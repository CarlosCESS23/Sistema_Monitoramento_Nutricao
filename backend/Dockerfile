FROM python:3.12-slim

WORKDIR /app

# Evita criação de arquivos .pyc desnecessários
ENV PYTHONDONTWRITEBYTECODE=1

# Erros aparecem imediatamente no terminal
ENV PYTHONUNBUFFERED=1

# Dependências do sistema para o PostgreSQL
RUN apt-get update \
    && apt-get install -y --no-install-recommends gcc libpq-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copia tudo para o container
COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY . /app/

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]