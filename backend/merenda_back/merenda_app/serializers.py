from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import (
    Aluno, Alergia, Refeicao, AlertaLog, Cardapio, Cardapio_refeicao,
    Restricoes_Alunos, Refeicao_Ingrediente, Restricoes_alimentares,
    Ingrediente, Nutricionista, Pais,
)


# ─── Validador de CPF (desabilitado para demo) ─────────────────────────────────
def validar_cpf(cpf: str) -> str:
    """
    Validação desabilitada — aceita qualquer formato para facilitar dados de demo.
    """
    return cpf


# ─── Pais ──────────────────────────────────────────────────────────────────────
class PaisSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pais
        fields = '__all__'
        read_only_fields = ['paicodigo', 'create_at', 'modified_at']
        extra_kwargs = {'paisenha': {'write_only': True}}

    def create(self, validated_data):
        validated_data['paisenha'] = make_password(validated_data['paisenha'])
        return super().create(validated_data)

    def update(self, instance, validated_data):
        if 'paisenha' in validated_data:
            validated_data['paisenha'] = make_password(validated_data['paisenha'])
        return super().update(instance, validated_data)


# ─── Aluno — Cadastro próprio (sem pai obrigatório) ───────────────────────────
class AlunoCadastroSerializer(serializers.ModelSerializer):
    """
    Usado quando o ALUNO cria a própria conta.
    O pai é opcional — pode ser vinculado depois.
    """
    class Meta:
        model = Aluno
        # Adicione 'aluidade' à lista de campos:
        fields = ['alucodigo', 'alunome', 'aluemail', 'alusenha', 'alumatricula', 'alucpf', 'aluidade', 'alupaicodigo']
        extra_kwargs = {
            'alusenha': {'write_only': True}
        }

    def validate_alucpf(self, value):
        return validar_cpf(value)

    def create(self, validated_data):
        validated_data['alusenha'] = make_password(validated_data['alusenha'])
        return super().create(validated_data)


# ─── Aluno — Serializer completo (pai vinculando filho) ───────────────────────
class AlunoSerializer(serializers.ModelSerializer):
    """
    Usado quando o PAI cria conta do filho ou para listagem completa.
    O pai é enviado no corpo da requisição.
    """
    class Meta:
        model = Aluno
        fields = '__all__'
        read_only_fields = ['alucodigo', 'create_at', 'modified_at']
        extra_kwargs = {'alusenha': {'write_only': True}}

    def validate_alucpf(self, value):
        return validar_cpf(value)

    def create(self, validated_data):
        validated_data['alusenha'] = make_password(validated_data['alusenha'])
        return super().create(validated_data)

    def update(self, instance, validated_data):
        if 'alusenha' in validated_data:
            validated_data['alusenha'] = make_password(validated_data['alusenha'])
        return super().update(instance, validated_data)

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if getattr(instance, 'alupaicodigo', None):
            representation['alupaicodigo_detalhes'] = PaisSerializer(instance.alupaicodigo).data
        return representation


# ─── Nutricionista ─────────────────────────────────────────────────────────────
class NutricionistaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Nutricionista
        fields = '__all__'
        read_only_fields = ['nutcodigo', 'create_at', 'modified_at']
        extra_kwargs = {'nutsenha': {'write_only': True}}

    def create(self, validated_data):
        validated_data['nutsenha'] = make_password(validated_data['nutsenha'])
        return super().create(validated_data)

    def update(self, instance, validated_data):
        if 'nutsenha' in validated_data:
            validated_data['nutsenha'] = make_password(validated_data['nutsenha'])
        return super().update(instance, validated_data)


# ─── Ingrediente ───────────────────────────────────────────────────────────────
class IngredienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingrediente
        fields = '__all__'
        read_only_fields = ['ingcodigo', 'create_at', 'modified_at']


# ─── Refeição ──────────────────────────────────────────────────────────────────
class RefeicaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Refeicao
        fields = '__all__'
        read_only_fields = ['refcodigo', 'create_at', 'modified_at']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if getattr(instance, 'refnutcodigo', None):
            representation['refnutcodigo_detalhes'] = NutricionistaSerializer(instance.refnutcodigo).data
        
        # O Django ManyToMany não traz lista de objs nativamente no ModelSerializer a menos que
        # explicitly defined, mas podemos injetar no representation
        if hasattr(instance, 'refalergias'):
            representation['refalergias_detalhes'] = AlergiaSerializer(instance.refalergias.all(), many=True).data

        return representation


# ─── Alergia ───────────────────────────────────────────────────────────────────
class AlergiaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alergia
        fields = '__all__'
        read_only_fields = ['alecodigo', 'create_at', 'modified_at']


# ─── Refeição Ingrediente ──────────────────────────────────────────────────────
class RefeicaoIngredienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Refeicao_Ingrediente
        fields = '__all__'
        read_only_fields = ['refingcodigo', 'create_at', 'modified_at']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if getattr(instance, 'refingrefcodigo', None):
            representation['refingrefcodigo_detalhes'] = RefeicaoSerializer(instance.refingrefcodigo).data
        if getattr(instance, 'refingingcodigo', None):
            representation['refingingcodigo_detalhes'] = IngredienteSerializer(instance.refingingcodigo).data
        return representation


# ─── Restrições Alimentares ────────────────────────────────────────────────────
class RestricoesAlimentaresSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restricoes_alimentares
        fields = '__all__'
        read_only_fields = ['resali_codigo', 'create_at', 'modified_at']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if getattr(instance, 'resali_alicodigo', None):
            representation['resali_alicodigo_detalhes'] = AlergiaSerializer(instance.resali_alicodigo).data
        if getattr(instance, 'resali_ingcodigo', None):
            representation['resali_ingcodigo_detalhes'] = IngredienteSerializer(instance.resali_ingcodigo).data
        return representation


# ─── Restrições Alunos ─────────────────────────────────────────────────────────
class RestricoesAlunosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restricoes_Alunos
        fields = '__all__'
        read_only_fields = ['resalu_codigo', 'create_at', 'modified_at']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if getattr(instance, 'resalu_alucodigo', None):
            representation['resalu_alucodigo_detalhes'] = AlunoSerializer(instance.resalu_alucodigo).data
        if getattr(instance, 'resalu_alecodigo', None):
            representation['resalu_alecodigo_detalhes'] = AlergiaSerializer(instance.resalu_alecodigo).data
        return representation


# ─── Alerta Log ────────────────────────────────────────────────────────────────
class AlertaLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = AlertaLog
        fields = '__all__'
        read_only_fields = ['logcodigo', 'create_at', 'modified_at']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if getattr(instance, 'logalunocodigo', None):
            representation['logalunocodigo_detalhes'] = AlunoSerializer(instance.logalunocodigo).data
        if getattr(instance, 'logalecodigo', None):
            representation['logalecodigo_detalhes'] = AlergiaSerializer(instance.logalecodigo).data
        if getattr(instance, 'logrefcodigo', None):
            representation['logrefcodigo_detalhes'] = RefeicaoSerializer(instance.logrefcodigo).data
        return representation


# ─── Cardápio Refeição ─────────────────────────────────────────────────────────
class CardapioRefeicaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cardapio_refeicao
        fields = '__all__'
        read_only_fields = ['carrefcodigo', 'create_at', 'modified_at']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if getattr(instance, 'carref_refcodigo', None):
            representation['carref_refcodigo_detalhes'] = RefeicaoSerializer(instance.carref_refcodigo).data
        return representation


# ─── Cardápio ──────────────────────────────────────────────────────────────────
class CardapioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cardapio
        fields = '__all__'
        read_only_fields = ['carcodigo', 'create_at', 'modified_at']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['refeicoes'] = CardapioRefeicaoSerializer(
            instance.cardapio_refeicao_set.all(), many=True
        ).data
        return representation