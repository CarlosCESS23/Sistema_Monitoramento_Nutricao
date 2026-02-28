from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import (
    Aluno, Alergia, Refeicao, AlertaLog, Cardapio, Cardapio_refeicao,
    Restricoes_Alunos, Refeicao_Ingrediente, Restricoes_alimentares,
    Ingrediente, Nutricionista, Pais,
)
from .serializers import (
    AlunoSerializer, AlunoCadastroSerializer, AlergiaSerializer,
    RefeicaoSerializer, AlertaLogSerializer, CardapioSerializer,
    CardapioRefeicaoSerializer, RestricoesAlunosSerializer,
    RefeicaoIngredienteSerializer, RestricoesAlimentaresSerializer,
    IngredienteSerializer, NutricionistaSerializer, PaisSerializer,
)


class PaisViewSet(viewsets.ModelViewSet):
    queryset = Pais.objects.all()
    serializer_class = PaisSerializer

    # ✅ FIX: cadastro é rota pública, demais exigem token
    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return [IsAuthenticated()]

    # POST /pais/{id}/adicionar_filho/
    # Pai vincula um aluno já existente como filho
    @action(detail=True, methods=['post'])
    def adicionar_filho(self, request, pk=None):
        pai = self.get_object()
        aluno_id = request.data.get('aluno_id')

        if not aluno_id:
            return Response(
                {'erro': 'aluno_id é obrigatório'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            aluno = Aluno.objects.get(pk=aluno_id)
        except Aluno.DoesNotExist:
            return Response(
                {'erro': 'Aluno não encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )

        if aluno.alupaicodigo is not None:
            return Response(
                {'erro': 'Aluno já possui um pai vinculado'},
                status=status.HTTP_400_BAD_REQUEST
            )

        aluno.alupaicodigo = pai
        aluno.save()
        return Response(
            {'status': f'Aluno {aluno.alunome} vinculado ao pai {pai.painome} com sucesso'},
            status=status.HTTP_200_OK
        )


class AlunoViewSet(viewsets.ModelViewSet):
    queryset = Aluno.objects.all()

    # ✅ FIX: cadastro é rota pública, demais exigem token
    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_serializer_class(self):
        """
        Escolhe o serializer correto dependendo da ação:
        - create → AlunoCadastroSerializer (aluno criando conta própria, pai opcional)
        - demais → AlunoSerializer (completo, com detalhes do pai)
        """
        if self.action == 'create':
            return AlunoCadastroSerializer
        return AlunoSerializer

    def get_queryset(self):
        # /alunos/?pai=3 → retorna só os filhos daquele pai
        pai_id = self.request.query_params.get('pai')
        if pai_id:
            return Aluno.objects.filter(alupaicodigo=pai_id)
        return super().get_queryset()

    # PATCH /alunos/{id}/vincular_pai/
    # Aluno vincula o próprio pai depois de já ter criado conta
    @action(detail=True, methods=['patch'])
    def vincular_pai(self, request, pk=None):
        aluno = self.get_object()
        pai_id = request.data.get('pai_id')

        if not pai_id:
            return Response(
                {'erro': 'pai_id é obrigatório'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            pai = Pais.objects.get(pk=pai_id)
        except Pais.DoesNotExist:
            return Response(
                {'erro': 'Pai não encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )

        if aluno.alupaicodigo is not None:
            return Response(
                {'erro': 'Aluno já possui um pai vinculado'},
                status=status.HTTP_400_BAD_REQUEST
            )

        aluno.alupaicodigo = pai
        aluno.save()
        return Response(
            {'status': f'Pai {pai.painome} vinculado ao aluno {aluno.alunome} com sucesso'},
            status=status.HTTP_200_OK
        )


class NutricionistaViewSet(viewsets.ModelViewSet):
    queryset = Nutricionista.objects.all()
    serializer_class = NutricionistaSerializer

    # ✅ FIX: cadastro é rota pública, demais exigem token
    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return [IsAuthenticated()]


class IngredienteViewSet(viewsets.ModelViewSet):
    queryset = Ingrediente.objects.all()
    serializer_class = IngredienteSerializer


class RefeicaoViewSet(viewsets.ModelViewSet):
    queryset = Refeicao.objects.all()
    serializer_class = RefeicaoSerializer

    def get_queryset(self):
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
        aluno_id = self.request.query_params.get('aluno')
        if aluno_id:
            return Restricoes_Alunos.objects.filter(resalu_alucodigo=aluno_id)
        return super().get_queryset()


class AlertaLogViewSet(viewsets.ModelViewSet):
    queryset = AlertaLog.objects.all()
    serializer_class = AlertaLogSerializer

    def get_queryset(self):
        aluno_id = self.request.query_params.get('aluno')
        visualizado = self.request.query_params.get('visualizado')
        qs = AlertaLog.objects.all()
        if aluno_id:
            qs = qs.filter(logalunocodigo=aluno_id)
        if visualizado is not None:
            qs = qs.filter(logvisualizacao=visualizado.lower() == 'true')
        return qs

    @action(detail=True, methods=['patch'])
    def marcar_visualizado(self, request, pk=None):
        alerta = self.get_object()
        alerta.logvisualizacao = True
        alerta.save()
        return Response(
            {'status': 'alerta marcado como visualizado'},
            status=status.HTTP_200_OK
        )


class CardapioRefeicaoViewSet(viewsets.ModelViewSet):
    queryset = Cardapio_refeicao.objects.all()
    serializer_class = CardapioRefeicaoSerializer


class CardapioViewSet(viewsets.ModelViewSet):
    queryset = Cardapio.objects.all()
    serializer_class = CardapioSerializer

    def get_queryset(self):
        data = self.request.query_params.get('data')
        if data:
            return Cardapio.objects.filter(cardata__date=data)
        return super().get_queryset()

    def perform_create(self, serializer):
        cardapio = serializer.save()
        self._gerar_alertas(cardapio)

    def perform_update(self, serializer):
        cardapio = serializer.save()
        # ✅ FIX: traversal correto — carref_carcodigo é o FK para Cardapio
        AlertaLog.objects.filter(
            logrefcodigo__cardapio_refeicao__carref_carcodigo=cardapio
        ).delete()
        self._gerar_alertas(cardapio)

    def _gerar_alertas(self, cardapio):
        # Alergias vindas dos ingredientes da refeição
        ingredientes = Ingrediente.objects.filter(
            refeicao_ingrediente__refingrefcodigo__cardapio_refeicao__carref_carcodigo=cardapio
        )
        alergias_dos_ingredientes = Restricoes_alimentares.objects.filter(
            resali_ingcodigo__in=ingredientes
        ).values_list('resali_alicodigo', flat=True)

        # Alergias associadas diretamente à refeição (novo campo refalergias)
        alergias_diretas = Alergia.objects.filter(
            refeicoes__cardapio_refeicao__carref_carcodigo=cardapio
        ).values_list('alecodigo', flat=True)

        alergias_presentes = set(list(alergias_dos_ingredientes) + list(alergias_diretas))

        restricoes = Restricoes_Alunos.objects.filter(
            resalu_alecodigo__in=alergias_presentes
        ).select_related('resalu_alucodigo', 'resalu_alecodigo')

        # ✅ FIX: traversal correto para buscar refeições do cardápio
        refeicoes = Refeicao.objects.filter(
            cardapio_refeicao__carref_carcodigo=cardapio
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