# Viral Vertical Videos Creator v2.0 - Guia de Desenvolvimento & Setup

Plataforma Web SaaS para criação em lote de vídeos verticais virais (Shorts, Reels, TikTok, Kwai) com IA, RAG semântico, renderização em nuvem e publicação via YouTube Data API v3 OAuth.

---

## 📋 Pré-Requisitos

- **Node.js**: v18.x ou superior
- **npm**: v9.x ou superior
- **PostgreSQL**: v15.x com extensão `vector` (Pgvector) instalada
- **Redis**: v7.x (ou Upstash Redis Cloud)

---

## 🚀 Passo a Passo de Instalação e Execução

### 1. Clonar o Repositório e Instalar Dependências
```bash
cd "Viral vertical videos creator V2"
npm install
```

### 2. Configurar Variáveis de Ambiente
Copie o arquivo de exemplo e configure suas chaves de API:
```bash
cp .env.example .env
```

### 3. Configurar o Banco de Dados com o Prisma ORM
Execute a geração dos artefatos do Prisma Client:
```bash
npx prisma generate
```

Caso esteja rodando PostgreSQL nativo, aplique as migrações:
```bash
npx prisma db push
```

### 4. Executar o Servidor de Desenvolvimento
```bash
npm run dev
```
Acesse a aplicação no navegador em: `http://localhost:3000`.

---

## 🛠️ Testando a Compilação do TypeScript

Para verificar a integridade dos tipos e checar se há erros de build:
```bash
./node_modules/.bin/tsc --noEmit
```

---

## 📄 Estrutura de Arquivos Importantes

- `schema.sql`: Script DDL em SQL puro para PostgreSQL com índices e suporte a Pgvector.
- `prisma/schema.prisma`: Schema Prisma ORM multi-tenant.
- `src/app/api/`: Route Handlers Serverless para os 8 módulos da aplicação.
- `src/lib/llm-orchestrator.ts`: Roteador Multi-LLM com fallback em cascata (OpenRouter -> OpenAI -> Gemini).
- `src/lib/smart-scheduler.ts`: Algoritmo de agendamento em lote com validação de janela (06h-22h).
