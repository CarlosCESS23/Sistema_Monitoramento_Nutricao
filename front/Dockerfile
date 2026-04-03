# ── Imagem base ─────────────────────────────────────────────────────────────
FROM node:22-slim

# Instala o Angular CLI globalmente
RUN npm install -g @angular/cli@21

# Define o diretório de trabalho
WORKDIR /app

# Copia apenas os manifests primeiro (cache de camadas)
COPY merenda_front/package.json merenda_front/package-lock.json ./

# Instala dependências
RUN npm ci

# Copia o restante do código-fonte
COPY merenda_front/ .

# Expõe a porta padrão do ng serve
EXPOSE 4200

# Variável de ambiente para desabilitar a proteção SSRF do Angular SSR dentro do Docker
ENV ANGULAR_APP_ALLOWED_HOSTS="*"

# Inicia o servidor de desenvolvimento
CMD ["ng", "serve", "--host", "0.0.0.0", "--poll", "2000"]
