from rest_framework.authentication import BaseAuthentication
from rest_framework import exceptions
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError


class CustomJWTAuthentication(BaseAuthentication):
    """
    Autenticacao JWT customizada que le o "tipo_usuario" do token
    e busca o usuario correto nas tabelas Pais, Aluno ou Nutricionista.
    Subclassifica BaseAuthentication para assumir controle total.
    """
    
    def authenticate(self, request):
        header = request.headers.get('Authorization')
        if not header or not header.startswith('Bearer '):
            return None

        raw_token = header.split(' ')[1]
        
        try:
            validated_token = AccessToken(raw_token)
        except (InvalidToken, TokenError) as e:
            raise exceptions.AuthenticationFailed('Token invalido ou expirado', code='invalid_token')

        from .models import Aluno, Nutricionista, Pais

        tipo_usuario = validated_token.get('tipo')
        user_id = validated_token.get('user_id')

        if not tipo_usuario or not user_id:
            raise exceptions.AuthenticationFailed(
                'Token invalido ou tipo de usuario ausente',
                code='invalid_token'
            )

        usuario = None
        try:
            if tipo_usuario == 'aluno':
                usuario = Aluno.objects.get(pk=user_id, active=True)
            elif tipo_usuario == 'nutricionista':
                usuario = Nutricionista.objects.get(pk=user_id, active=True)
            elif tipo_usuario == 'pai':
                usuario = Pais.objects.get(pk=user_id, active=True)
            else:
                raise exceptions.AuthenticationFailed('Tipo de usuario desconhecido')
        except (Aluno.DoesNotExist, Nutricionista.DoesNotExist, Pais.DoesNotExist):
            raise exceptions.AuthenticationFailed(
                'Usuario nao encontrado',
                code='user_not_found'
            )

        usuario.is_authenticated = True
        return (usuario, validated_token)

    def authenticate_header(self, request):
        return 'Bearer'