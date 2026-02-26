from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import (
    Aluno,
    Alergia,
    Refeicao,
    AlertaLog,
    Cardapio,
    Cardapio_refeicao,
    Restricoes_Alunos,
    Refeicao_Ingrediente,
    Restricoes_alimentares,
    Ingrediente,
    Nutricionista,
    Pais,
)
from .serializers import (
    AlunoSerializer,
    AlergiaSerializer,
    RefeicaoSerializer,
    AlertaLogSerializer,
    CardapioSerializer,
    CardapioRefeicaoSerializer,
    RestricoesAlunosSerializer,
    RefeicaoIngredienteSerializer,
    RestricoesAlimentaresSerializer,
    IngredienteSerializer,
    NutricionistaSerializer,
    PaisSerializer,
)


class PaisViewSet(viewsets.ModelViewSet):
    queryset = Pais.objects.all()
    serializer_class = PaisSerializer


class AlunoViewSet(viewsets.ModelViewSet):
    queryset = Aluno.objects.all()
    serializer_class = AlunoSerializer

    def get_queryset(self):
        # /alunos/?pai=3 → retorna só os filhos daquele pai
        pai_id = self.request.query_params.get('pai')
        if pai_id:
            return Aluno.objects.filter(alupaicodigo=pai_id)
        return super().get_queryset()


class NutricionistaViewSet(viewsets.ModelViewSet):
    queryset = Nutricionista.objects.all()
    serializer_class = NutricionistaSerializer


class IngredienteViewSet(viewsets.ModelViewSet):
    queryset = Ingrediente.objects.all()
    serializer_class = IngredienteSerializer


class RefeicaoViewSet(viewsets.ModelViewSet):
    queryset = Refeicao.objects.all()
    serializer_class = RefeicaoSerializer

    def get_queryset(self):
        # /refeicoes/?nutricionista=2 → refeições de um nutricionista específico
        nut_id = self.request.query_params.get('nutricionista')
        if nut_id:
            return Refeicao.objects.filter(refnutcodigo=nut_id)
        return super().get_queryset()


class AlergiaViewSet(viewsets.ModelViewSet):
    queryset = Alergia.objects.all()
    serializer_class = AlergiaSerializer


class RefeicaoIngredienteViewSet(viewsets.ModelViewSet):
    queryset = Refeicao_Ingrediente.objects.all()
    serializer_class = RefeicaoIngredienteSerializer

    def get_queryset(self):
        # /refeicao-ingredientes/?refeicao=1 → ingredientes de uma refeição
        ref_id = self.request.query_params.get('refeicao')
        if ref_id:
            return Refeicao_Ingrediente.objects.filter(refingrefcodigo=ref_id)
        return super().get_queryset()


class RestricoesAlimentaresViewSet(viewsets.ModelViewSet):
    queryset = Restricoes_alimentares.objects.all()
    serializer_class = RestricoesAlimentaresSerializer


class RestricoesAlunosViewSet(viewsets.ModelViewSet):
    queryset = Restricoes_Alunos.objects.all()
    serializer_class = RestricoesAlunosSerializer

    def get_queryset(self):
        # /restricoes-alunos/?aluno=5 → restrições de um aluno específico
        aluno_id = self.request.query_params.get('aluno')
        if aluno_id:
            return Restricoes_Alunos.objects.filter(resalu_alucodigo=aluno_id)
        return super().get_queryset()


class AlertaLogViewSet(viewsets.ModelViewSet):
    queryset = AlertaLog.objects.all()
    serializer_class = AlertaLogSerializer

    def get_queryset(self):
        # /alertas/?aluno=5             → alertas de um aluno
        # /alertas/?aluno=5&visualizado=false → só os não visualizados
        aluno_id = self.request.query_params.get('aluno')
        visualizado = self.request.query_params.get('visualizado')
        qs = AlertaLog.objects.all()
        if aluno_id:
            qs = qs.filter(logalunocodigo=aluno_id)
        if visualizado is not None:
            qs = qs.filter(logvisualizacao=visualizado.lower() == 'true')
        return qs

    # PATCH /alertas/{id}/marcar_visualizado/ → pai marca o alerta como lido
    @action(detail=True, methods=['patch'])
    def marcar_visualizado(self, request, pk=None):
        alerta = self.get_object()
        alerta.logvisualizacao = True
        alerta.save()
        return Response({'status': 'alerta marcado como visualizado'}, status=status.HTTP_200_OK)


class CardapioRefeicaoViewSet(viewsets.ModelViewSet):
    queryset = Cardapio_refeicao.objects.all()
    serializer_class = CardapioRefeicaoSerializer


class CardapioViewSet(viewsets.ModelViewSet):
    queryset = Cardapio.objects.all()
    serializer_class = CardapioSerializer

    def perform_create(self, serializer):
        cardapio = serializer.save()
        self._gerar_alertas(cardapio)  # dispara automaticamente após salvar

    def perform_update(self, serializer):
        cardapio = serializer.save()
        # Correção 1: Caminho direto (AlertaLog -> Refeicao -> Cardapio)
        AlertaLog.objects.filter(
            logrefcodigo__cardapio__carcodigo=cardapio.carcodigo
        ).delete()
        self._gerar_alertas(cardapio)

    def _gerar_alertas(self, cardapio):
        # Correção 2: Caminho direto (Ingrediente -> Refeicao -> Cardapio)
        ingredientes = Ingrediente.objects.filter(
            refeicao__cardapio__carcodigo=cardapio.carcodigo
        )

        alergias_presentes = Restricoes_alimentares.objects.filter(
            resali_ingcodigo__in=ingredientes
        ).values_list('resali_alicodigo', flat=True)

        restricoes = Restricoes_Alunos.objects.filter(
            resalu_alecodigo__in=alergias_presentes
        ).select_related('resalu_alucodigo', 'resalu_alecodigo')

        # Correção 3: Caminho direto (Refeicao -> Cardapio)
        refeicoes = Refeicao.objects.filter(
            cardapio__carcodigo=cardapio.carcodigo
        )

        alertas = []
        for restricao in restricoes:
            for refeicao in refeicoes:
                alertas.append(AlertaLog(
                    logalunocodigo=restricao.resalu_alucodigo,
                    logalecodigo=restricao.resalu_alecodigo,
                    logrefcodigo=refeicao,
                    logvisualizacao=False
                ))

        AlertaLog.objects.bulk_create(alertas, ignore_conflicts=True)

    def get_queryset(self):
        data = self.request.query_params.get('data')
        if data:
            return Cardapio.objects.filter(cardata__date=data)
        return super().get_queryset()