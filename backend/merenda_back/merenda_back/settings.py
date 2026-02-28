from pathlib import Path
from decouple import config
from datetime import timedelta

BASE_DIR = Path(__file__).resolve().parent.parent

# ─── Segurança Principal ───────────────────────────────────────────────────────
# Lê do .env — nunca hardcoded no código!
SECRET_KEY = config('SECRET_KEY')
DEBUG = config('DEBUG', default=False, cast=bool)
ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='localhost,127.0.0.1').split(',')

# ─── Apps ─────────────────────────────────────────────────────────────────────
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Terceiros
    'rest_framework',
    'corsheaders',          # ← CORS habilitado

    # App do projeto
    'merenda_app',
]

# ─── Middleware ────────────────────────────────────────────────────────────────
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',   # ← deve vir ANTES do CommonMiddleware
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# ─── CORS ─────────────────────────────────────────────────────────────────────
# Permite o Angular (rodando em outra porta) chamar a API
CORS_ALLOWED_ORIGINS = config(
    'CORS_ALLOWED_ORIGINS',
    default='http://localhost:4200'
).split(',')

CORS_ALLOW_CREDENTIALS = True   # permite envio de cookies/tokens nas requisições

# ─── Django REST Framework + JWT ──────────────────────────────────────────────
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'merenda_app.authentication.CustomJWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        # Exige autenticação em todos os endpoints por padrão
        'rest_framework.permissions.IsAuthenticated',
    ),
}

# ─── Configuração do JWT ───────────────────────────────────────────────────────
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=1),     # token expira em 1 hora
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),     # refresh expira em 7 dias
    'ROTATE_REFRESH_TOKENS': True,                   # gera novo refresh a cada uso
    'BLACKLIST_AFTER_ROTATION': True,                # invalida o refresh antigo
    'ALGORITHM': 'HS256',
    'AUTH_HEADER_TYPES': ('Bearer',),
}

# ─── Banco de Dados ────────────────────────────────────────────────────────────
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': config('DB_NAME'),
        'USER': config('DB_USER'),
        'PASSWORD': config('DB_PASSWORD'),
        'HOST': config('DB_HOST', default='db'),     # 'db' = nome do service no docker-compose
        'PORT': config('DB_PORT', default='5432'),
    }
}

# ─── Hash de Senha ─────────────────────────────────────────────────────────────
# Argon2 é o algoritmo mais seguro para armazenar senhas
PASSWORD_HASHERS = [
    'django.contrib.auth.hashers.Argon2PasswordHasher',   # ← prioridade máxima
    'django.contrib.auth.hashers.PBKDF2PasswordHasher',   # fallback
    'django.contrib.auth.hashers.BCryptSHA256PasswordHasher',
]

# ─── Configurações de Segurança HTTP ──────────────────────────────────────────
# Essas configs são ignoradas enquanto DEBUG=True, mas já deixamos prontas para prod
SECURE_BROWSER_XSS_FILTER = True               # proteção contra XSS
X_FRAME_OPTIONS = 'DENY'                       # impede iframe (proteção clickjacking)
SECURE_CONTENT_TYPE_NOSNIFF = True             # impede MIME sniffing

ROOT_URLCONF = 'merenda_back.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'merenda_back.wsgi.application'

# ─── Validação de Senha ───────────────────────────────────────────────────────
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
     'OPTIONS': {'min_length': 8}},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# ─── Internacionalização ──────────────────────────────────────────────────────
LANGUAGE_CODE = 'pt-br'
TIME_ZONE = 'America/Manaus'
USE_I18N = True
USE_TZ = True

STATIC_URL = 'static/'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'