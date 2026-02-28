from django.db import models
from django.core.validators import RegexValidator

# Validador de CPF formatado (000.000.000-00)
cpf_validator = RegexValidator(
    regex=r'^\d{3}\.\d{3}\.\d{3}-\d{2}$',
    message='CPF deve estar no formato 000.000.000-00'
)

class BaseModel(models.Model):
    create_at = models.DateTimeField(db_column='dt_created', auto_now_add=True, null=True)
    modified_at = models.DateTimeField(db_column='dt_modified', auto_now=True, null=True)
    active = models.BooleanField(db_column='cs_active', null=False, default=True)

    @property
    def is_authenticated(self):
        return True

    class Meta:
        abstract = True


class Pais(BaseModel):
    paicodigo = models.BigAutoField(db_column='paicodigo', null=False, primary_key=True)
    painome = models.CharField(db_column='painome', null=False)
    paiemail = models.EmailField(db_column='paiemail', null=False)
    paisenha = models.CharField(db_column='paisenha', max_length=255, null=False)
    paicpf = models.CharField(
        db_column='paicpf',
        max_length=14,          # 000.000.000-00 = 14 caracteres
        null=False,
        unique=True,            # CPF único no sistema
        validators=[cpf_validator]
    )

    def __str__(self):
        return f'{self.painome} - {self.paicpf}'


class Aluno(BaseModel):
    alucodigo = models.BigAutoField(db_column='alucodigo', null=False, primary_key=True)
    alunome = models.CharField(db_column='alunome', max_length=60, null=False)
    aluemail = models.EmailField(db_column='aluemail', null=False)
    alusenha = models.CharField(db_column='alusenha', max_length=255, null=False)
    alumatricula = models.CharField(db_column='alumatricula', max_length=60, null=False)
    aluidade = models.IntegerField(
        db_column= 'aluidade',
        null = False,

    )
      
    alucpf = models.CharField(
        db_column='alucpf',
        max_length=14,
        null=False,
        unique=True,            # CPF único no sistema
        validators=[cpf_validator]
    )
    # ← FK agora é OPCIONAL — aluno pode criar conta sem pai
    alupaicodigo = models.ForeignKey(
        Pais,
        db_column='alupaicodigo',
        null=True,              # opcional
        blank=True,
        on_delete=models.SET_NULL   # se pai for deletado, aluno não some
    )

    def __str__(self):
        return f'{self.alunome} - {self.alumatricula}'


class Nutricionista(BaseModel):
    nutcodigo = models.BigAutoField(db_column='nutcodigo', null=False, primary_key=True)
    nutnome = models.CharField(db_column='nutnome', max_length=60, null=False)
    nutemail = models.EmailField(db_column='nutemail', null=False)
    nutsenha = models.CharField(db_column='nutsenha', null=False, max_length=255)

    def __str__(self):
        return f'{self.nutnome} - {self.nutemail}'


class Ingrediente(BaseModel):
    ingcodigo = models.BigAutoField(db_column='ingcodigo', null=False, primary_key=True)
    ingtipo = models.CharField(db_column='ingtipo', null=False)

    def __str__(self):
        return self.ingtipo


class Refeicao(BaseModel):
    refcodigo = models.BigAutoField(db_column='refcodigo', null=False, primary_key=True)
    refnome = models.CharField(db_column='refnome', max_length=60, null=False)
    refnutcodigo = models.ForeignKey(Nutricionista, db_column='refnutcodigo', on_delete=models.CASCADE)
    refproteina = models.IntegerField(db_column='refproteina', null=False)
    refcarboidrato = models.IntegerField(db_column='refcarboidrato', null=False)
    refcalorias = models.IntegerField(db_column='refcalorias', null=False)
    refingredientes = models.ManyToManyField(Ingrediente, through='Refeicao_Ingrediente')

    def __str__(self):
        return f'{self.refcodigo} - {self.refnome}'


class Alergia(BaseModel):
    alecodigo = models.BigAutoField(db_column='alecodigo', primary_key=True, null=False)
    aletipo = models.CharField(db_column='aletipo', null=False, max_length=50)
    restricoes_alimentares = models.ManyToManyField(Ingrediente, through='Restricoes_alimentares')
    restricoes_alunos = models.ManyToManyField(Aluno, through='Restricoes_Alunos')

    def __str__(self):
        return self.aletipo


class Refeicao_Ingrediente(BaseModel):
    refingcodigo = models.BigAutoField(db_column='refingcodigo', null=False, primary_key=True)
    refingrefcodigo = models.ForeignKey(Refeicao, db_column='refing_refcodigo', on_delete=models.PROTECT)
    refingingcodigo = models.ForeignKey(Ingrediente, db_column='refing_ingcodigo', on_delete=models.PROTECT)

    def __str__(self):
        return f'{self.refingrefcodigo.refnome} - {self.refingingcodigo.ingtipo}'


class Restricoes_alimentares(BaseModel):
    resali_codigo = models.BigAutoField(db_column='resali_codigo', primary_key=True, null=False)
    resali_alicodigo = models.ForeignKey(
        Alergia, db_column='resali_alecodigo', null=False,
        on_delete=models.CASCADE, related_name='ingredientes_restritos'
    )
    resali_ingcodigo = models.ForeignKey(Ingrediente, db_column='resali_ingcodigo', null=False, on_delete=models.CASCADE)


class Restricoes_Alunos(BaseModel):
    resalu_codigo = models.BigAutoField(db_column='resalu_codigo', primary_key=True, null=False)
    resalu_alucodigo = models.ForeignKey(Aluno, db_column='resalu_alucodigo', on_delete=models.PROTECT)
    resalu_alecodigo = models.ForeignKey(
        Alergia, db_column='resalu_alecodigo', on_delete=models.PROTECT, related_name='aluno_restricao'
    )

    def __str__(self):
        return f'{self.resalu_alucodigo.alunome} - {self.resalu_alecodigo.aletipo}'


class AlertaLog(BaseModel):
    logcodigo = models.BigAutoField(primary_key=True, null=False, db_column='logcodigo')
    logalunocodigo = models.ForeignKey(Aluno, null=False, db_column='logalunocodigo', on_delete=models.PROTECT)
    logalecodigo = models.ForeignKey(Alergia, null=False, db_column='logalecodigo', on_delete=models.PROTECT)
    logrefcodigo = models.ForeignKey(Refeicao, null=False, db_column='logrefcodigo', on_delete=models.PROTECT)
    logvisualizacao = models.BooleanField(db_column='logvisualizacao', null=True, default=False)

    def __str__(self):
        return f'{self.logalunocodigo.alunome} - {self.logalecodigo.aletipo} - Visualizado: {self.logvisualizacao}'


class Cardapio(BaseModel):
    carcodigo = models.BigAutoField(db_column='carcodigo', null=False, primary_key=True)
    cardata = models.DateTimeField(db_column='cardata', null=False)
    carrefeicoes = models.ManyToManyField(Refeicao, through='Cardapio_refeicao')

    def __str__(self):
        return f'{self.carcodigo} - {self.cardata.strftime("%Y-%m-%d")}'


class Cardapio_refeicao(BaseModel):
    carrefcodigo = models.BigAutoField(db_column='carrefcodigo', null=False, primary_key=True)
    carref_refcodigo = models.ForeignKey(Refeicao, db_column='carref_refcodigo', on_delete=models.PROTECT)
    carref_carcodigo = models.ForeignKey(Cardapio, db_column='carref_carcodigo', on_delete=models.PROTECT)