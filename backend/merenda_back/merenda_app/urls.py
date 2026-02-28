from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .auth_views import LoginView, RefreshView
from .viewsets import (
    PaisViewSet,
    AlunoViewSet,
    NutricionistaViewSet,
    IngredienteViewSet,
    RefeicaoViewSet,
    AlergiaViewSet,
    RefeicaoIngredienteViewSet,
    RestricoesAlimentaresViewSet,
    RestricoesAlunosViewSet,
    AlertaLogViewSet,
    CardapioRefeicaoViewSet,
    CardapioViewSet,
)

router = DefaultRouter()
router.register(r'pais', PaisViewSet)
router.register(r'alunos', AlunoViewSet)
router.register(r'nutricionistas', NutricionistaViewSet)
router.register(r'ingredientes', IngredienteViewSet)
router.register(r'refeicoes', RefeicaoViewSet)
router.register(r'alergias', AlergiaViewSet)
router.register(r'refeicao-ingredientes', RefeicaoIngredienteViewSet)
router.register(r'restricoes-alimentares', RestricoesAlimentaresViewSet)
router.register(r'restricoes-alunos', RestricoesAlunosViewSet)
router.register(r'alertas-log', AlertaLogViewSet)
router.register(r'cardapio-refeicoes', CardapioRefeicaoViewSet)
router.register(r'cardapios', CardapioViewSet)

urlpatterns = [
    # Endpoints de autenticacao (usam auth_views.py, nao o simplejwt padrao)
    path('token/', LoginView.as_view(), name='token_obtain'),
    path('token/refresh/', RefreshView.as_view(), name='token_refresh'),

    # Todos os outros endpoints REST
    path('', include(router.urls)),
]