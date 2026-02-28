from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from django.contrib.auth.hashers import check_password


class LoginView(APIView):
    """
    Endpoint customizado de login que suporta os 3 tipos de usuario.
    Recebe: { email, password, tipo }
    Retorna: { access, refresh, tipo, id, nome, email }
    """
    permission_classes = [AllowAny]

    def post(self, request):
        from .models import Pais, Aluno, Nutricionista

        email = request.data.get('email', '').strip().lower()
        senha = request.data.get('password', '')
        tipo  = request.data.get('tipo', '')

        if not email or not senha or not tipo:
            return Response(
                {'erro': 'email, password e tipo sao obrigatorios.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if tipo not in ('pai', 'aluno', 'nutricionista'):
            return Response(
                {'erro': 'tipo deve ser pai, aluno ou nutricionista.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        usuario_id = None
        nome = ''
        autenticado = False

        if tipo == 'pai':
            try:
                obj = Pais.objects.get(paiemail__iexact=email, active=True)
                if check_password(senha, obj.paisenha):
                    autenticado = True
                    usuario_id = obj.paicodigo
                    nome = obj.painome
            except Pais.DoesNotExist:
                pass

        elif tipo == 'aluno':
            try:
                obj = Aluno.objects.get(aluemail__iexact=email, active=True)
                if check_password(senha, obj.alusenha):
                    autenticado = True
                    usuario_id = obj.alucodigo
                    nome = obj.alunome
            except Aluno.DoesNotExist:
                pass

        elif tipo == 'nutricionista':
            try:
                obj = Nutricionista.objects.get(nutemail__iexact=email, active=True)
                if check_password(senha, obj.nutsenha):
                    autenticado = True
                    usuario_id = obj.nutcodigo
                    nome = obj.nutnome
            except Nutricionista.DoesNotExist:
                pass

        # Mesma mensagem para email inexistente e senha errada
        # (evita que atacante descubra quais emails estao cadastrados)
        if not autenticado:
            return Response(
                {'erro': 'Credenciais invalidas.'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        token = _gerar_token(usuario_id, tipo, nome)

        return Response({
            'access':  str(token.access_token),
            'refresh': str(token),
            'tipo':    tipo,
            'id':      usuario_id,
            'nome':    nome,
            'email':   email,
        }, status=status.HTTP_200_OK)


class RefreshView(APIView):
    """Renova o access token usando o refresh token."""
    permission_classes = [AllowAny]

    def post(self, request):
        refresh_token = request.data.get('refresh')
        if not refresh_token:
            return Response(
                {'erro': 'refresh token e obrigatorio.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            token = RefreshToken(refresh_token)
            return Response({'access': str(token.access_token)})
        except TokenError:
            return Response(
                {'erro': 'Token invalido ou expirado.'},
                status=status.HTTP_401_UNAUTHORIZED
            )


# ── Helpers ────────────────────────────────────────────────────────────────────

class _FakeUser:
    """
    simplejwt.RefreshToken.for_user() espera .pk, .id e .is_active.
    USER_ID_FIELD do simplejwt e "id" por padrao -- precisa dos dois.
    """
    def __init__(self, pk):
        self.pk = pk
        self.id = pk        # simplejwt usa getattr(user, USER_ID_FIELD) = "id"
        self.is_active = True


def _gerar_token(usuario_id, tipo, nome):
    """
    Gera RefreshToken com claims customizados.
    O campo 'tipo' e lido pelo CustomJWTAuthentication em authentication.py.
    """
    token = RefreshToken.for_user(_FakeUser(usuario_id))
    token['tipo'] = tipo
    token['nome'] = nome
    token.access_token['tipo'] = tipo
    token.access_token['nome'] = nome
    return token