from rest_framework import status
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.authentication import get_authorization_header
from django.contrib.auth.hashers import check_password
from rest_framework import exceptions


class CustomJWTAuthentication(JWTAuthentication):
    """
    Autenticação JWT customizada que lê o "tipo_usuario" do token 
    e busca o usuário correto nas tabelas Pais, Aluno ou Nutricionista.
    """
    def get_user(self, validated_token):
        from .models import Aluno, Nutricionista, Pais
        
        tipo_usuario = validated_token.get('tipo_usuario')
        user_id = validated_token.get('user_id')

        if not tipo_usuario or not user_id:
            raise exceptions.AuthenticationFailed('Token inválido ou tipo de usuário ausente', code='invalid_token')

        try:
            if tipo_usuario == 'aluno':
                return Aluno.objects.get(pk=user_id)
            elif tipo_usuario == 'nutricionista':
                return Nutricionista.objects.get(pk=user_id)
            elif tipo_usuario == 'pai':
                return Pais.objects.get(pk=user_id)
            else:
                raise exceptions.AuthenticationFailed('Tipo de usuário desconhecido')
        except (Aluno.DoesNotExist, Nutricionista.DoesNotExist, Pais.DoesNotExist):
            raise exceptions.AuthenticationFailed('Usuário não encontrado', code='user_not_found')


class CustomTokenObtainPairView(TokenObtainPairView):
    """
    Endpoint de Login customizado para as 3 tabelas diferentes.
    Espera receber {"email": "...", "password": "...", "tipo": "aluno|nutricionista|pai"}
    """
    
    def post(self, request, *args, **kwargs):
        from .models import Aluno, Nutricionista, Pais
        
        email = request.data.get('email')
        password = request.data.get('password')
        tipo = request.data.get('tipo')

        if not email or not password or not tipo:
            return Response({'detail': 'Email, password e tipo são obrigatórios.'}, status=status.HTTP_400_BAD_REQUEST)

        user = None
        user_id = None

        # Procura o usuário na tabela correta baseada no "tipo" e valida a senha
        if tipo == 'aluno':
            user = Aluno.objects.filter(aluemail=email).first()
            if user and check_password(password, user.alusenha):
                user_id = user.alucodigo
            else:
                user = None
                
        elif tipo == 'nutricionista':
            user = Nutricionista.objects.filter(nutemail=email).first()
            if user and check_password(password, user.nutsenha):
                user_id = user.nutcodigo
            else:
                user = None
                
        elif tipo == 'pai':
            user = Pais.objects.filter(paiemail=email).first()
            if user and check_password(password, user.paisenha):
                user_id = user.paicodigo
            else:
                user = None
        else:
            return Response({'detail': 'Tipo de usuário inválido.'}, status=status.HTTP_400_BAD_REQUEST)

        if user is None:
            return Response({'detail': 'Credenciais inválidas.'}, status=status.HTTP_401_UNAUTHORIZED)

        # Usuário autenticado com sucesso, gerar tokens
        refresh = RefreshToken()
        refresh['user_id'] = user_id
        refresh['tipo_usuario'] = tipo

        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })
