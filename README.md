# Merenda MVP - Sistema de Gerenciamento de Merenda Escolar com Alertas de Alergia

## 🚀 Visão Geral
O **Merenda MVP** é um sistema fullstack **Dockerizado** para gerenciar cardápios escolares, com foco em **segurança alimentar**. Nutricionistas criam refeições considerando alergias e restrições, o sistema gera **alertas automáticos** para pais, evitando acidentes graves.

**Problema resolvido**: Alunos com alergias recebendo refeições perigosas por falta de comunicação entre cozinha/escola/pais.

## 🏗️ Arquitetura
```
Frontend (Angular 21 SSR + Tailwind)  →  API REST (Django 6 + DRF + JWT)  →  PostgreSQL 15
       http://localhost:4200                    http://localhost:9000             localhost:5434
```

| Camada | Tecnologias | Porta |
|--------|-------------|-------|
| **Frontend** | Angular 21 (SSR), TailwindCSS | 4200 |
| **Backend** | Django 6, DRF, JWT (SimpleJWT), Argon2 | 9000 |
| **Banco** | PostgreSQL 15 | 5434 |
| **Deploy** | Docker Compose | - |

## 🎯 Funcionalidades Principais

### 1. **Cadastro Seguro**
```
Pais (CPF único) ←→ Alunos (matrícula + idade + restrições) ←→ Nutricionistas
```
- Validação rigorosa de CPF (`000.000.000-00`)
- Vinculação flexível pai-filho
- Senhas com Argon2 (mais seguro que bcrypt)

### 2. **Gerenciamento Nutricional**
```
Refeição = {nome, nutrientes, ingredientes, foto, alergias M2M}
```
- Macros: Proteína/Carbo/Calorias
- Upload de imagens
- Filtro por nutricionista

### 3. **Sistema de Alertas Inteligente** ⭐
```
Cardápio Diário → Detecta Conflitos → Gera Alertas → Notifica Pais
```
**Algoritmo automático**:
```
1. Cardápio tem refeições → tem ingredientes
2. Ingredientes → Alergias restritas → Alunos afetados
3. Cria AlertaLog para cada aluno/pai
4. Pais marcam \"visualizado\" no dashboard
```

### 4. **Dashboards Intuitivos**
| Usuário | Funcionalidades |
|---------|-----------------|
| **Pais** | Ver alertas dos filhos, lista de filhos |
| **Nutricionista** | Criar refeições, montar cardápios, ver histórico |

## 🛠️ Como Executar (5 minutos)

### Pré-requisitos
```
Docker + Docker Compose
Node.js 20+ (apenas dev)
```

### 1. Configurar Backend
```bash
cd backend
cp .env.example .env  # Edite SECRET_KEY, DEBUG=False em prod
```

### 2. Subir Tudo
```bash
# Na raiz do projeto
docker compose up -d --build
```

### 3. Primeiros Passos
```bash
# Migrações
docker compose exec backend python manage.py migrate

# Superusuário
docker compose exec backend python manage.py createsuperuser

# Seed (dados demo)
psql -h localhost -p 5434 -U merenda -d merenda -f seed_demo.sql
```

### 4. Acessar
| URL | Descrição |
|----|-----------|
| [http://localhost:4200/login](http://localhost:4200/login) | **Frontend** (login/registro) |
| [http://localhost:9000/admin](http://localhost:9000/admin) | **Django Admin** |
| [http://localhost:9000/swagger](http://localhost:9000/swagger) | **API Docs** (se habilitado) |

### Desenvolvimento Frontend
```bash
cd front/merenda_front
npm install
npm run start  # http://localhost:4200
```

## 📋 API Endpoints (DRF + JWT)
**Autenticação**: `Authorization: Bearer <token>`

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| `POST` | `/pais/` | Cadastrar pai | Pública |
| `POST` | `/alunos/` | Cadastrar aluno | Pública |
| `POST` | `/pais/{id}/adicionar_filho/` | Vincular filho | Token |
| `GET` | `/alunos/?pai=1` | Filhos do pai | Token |
| `GET` | `/cardapio/?data=2024-10-01` | Cardápio do dia | Token |
| `GET` | `/alertas/?aluno=1&visualizado=false` | Alertas não lidos | Token |
| `PATCH` | `/alertas/{id}/marcar_visualizado/` | Confirmar alerta | Token |

## 🗄️ Modelo de Dados (Diagrama Simplificado)
```
Pais ──┐
       └── Aluno ── Restrições ── Alergia ──┐
                                            └── Ingrediente ← Refeicao ← Cardapio
Nutricionista ─┤                                    ↑
               └── Refeicao ── AlertaLog ── Aluno ──┘
```

## 🔒 Segurança Implementada
- ✅ **JWT** rotativo (1h access, 7d refresh)
- ✅ **Argon2** para hash de senhas
- ✅ **CORS** restrito
- ✅ **CPF único** validado
- ✅ **Upload protegido** (MEDIA_ROOT)
- ✅ **Logs auditados** (AlertaLog)


**Feito com ❤️ para segurança das crianças!** 🌟
