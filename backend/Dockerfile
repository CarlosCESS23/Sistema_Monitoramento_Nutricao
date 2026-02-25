FROM python:3.12-slim

WORKDIR /app

#Utilizando variáveis de ambiente para otimizar o Python
#Exemplo a baixo, evita a criações de arquivos .pyc inúteis
ENV PYTHONDONTWRITEBYTECODE = 1 

#Isso que faz os erros apareçam na hora, ao invés de só aparecerem quando o programa roda
ENV PYTHONUNBUFFERED = 1


# Instala as dependências do sistema operacional necessárias para o psycopg (PostgreSQL)
RUN apt-get update \
    && apt-get install -y --no-install-recommends gcc libpq-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*


#Instala as bibliotecas Python
COPY app /app/app
COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Criação da porta que o Django irá utilizar:
EXPOSE 8000

# Comando que será executado quando o container for iniciado:
CMD ["python","manage.py","runserver","0.0.0.0:8000"]

