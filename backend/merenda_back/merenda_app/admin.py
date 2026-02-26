from django.contrib import admin
from .models import *

# Register your models here.

admin.site.register(Aluno)
admin.site.register(Pais)
admin.site.register(Nutricionista)
admin.site.register(Ingrediente)
admin.site.register(Refeicao)
admin.site.register(Alergia)
admin.site.register(Refeicao_Ingrediente)
admin.site.register(Restricoes_alimentares)
admin.site.register(Restricoes_Alunos)
admin.site.register(AlertaLog)
admin.site.register(Cardapio_refeicao)
