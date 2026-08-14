# Guia de Implantação em Produção & Rollback (DEPLOYMENT.md)

> **Viral Vertical Videos Creator v2.0 - Web SaaS**  
> **Status:** Prisioneiro de Produção (Production Ready)  
> **First Load JS:** 87.2 kB (< 500 kB target) | **Pages Prerendered:** 34/34

---

## 🌐 1. Arquitetura de Produção

- **Frontend & APIs:** Next.js 14 App Router hospedado na Vercel (Edge & Serverless Route Handlers).
- **Banco de Dados:** PostgreSQL 15+ (Neon.tech / Supabase) com PgBouncer Connection Pooling (`sslmode=require`).
- **Cache & Filas Assíncronas:** Upstash Redis (Serverless).
- **Workers de Renderização:** AWS ECS Fargate Docker Containers (`Dockerfile` com FFmpeg acelerado por GPU).
- **Armazenamento de Mídias:** AWS S3 + CDN CloudFront (Bucket: `viral-creator-prod-bucket`).

---

## 🚀 2. Procedimento de Deploy (Vercel + GitHub)

### Deploy Automático via GitHub Actions:
Qualquer `push` para a branch `main` dispara os testes automatizados em Jest e aciona o deploy na Vercel:

```bash
git add .
git commit -m "feat: release production build"
git push origin main
```

### Deploy Manual via CLI:
```bash
npx vercel --prod
```

---

## 🔄 3. Procedimento de Rollback de Emergência

Em caso de degradação em produção:

1. **Rollback de Instante na Vercel:**
```bash
npx vercel rollback [DEPLOYMENT_ID_ANTERIOR]
```
Ou acesse **Vercel Dashboard** -> **Deployments** -> Selecionar Deploy Anterior -> **Promote to Production**.

2. **Rollback de Banco de Dados:**
```bash
npx prisma migrate resolve --rolled-back [MIGRATION_NAME]
```

---

## 📊 4. Backup & Disaster Recovery (DRP)

- **Backups de Banco:** Backups automáticos diários retidos por 30 dias via Neon / Supabase.
- **Restauração de Arquivos S3:** Versionamento de Bucket ativado no AWS S3 (`viral-creator-prod-bucket`).
- **Tempo Estimado de Recuperação (RTO):** < 15 minutos.
- **Ponto Estimado de Recuperação (RPO):** < 1 minuto.
