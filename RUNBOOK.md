# Runbook de Operações de Produção & Resposta a Incidentes (RUNBOOK.md)

> **Viral Vertical Videos Creator v2.0 - Web SaaS**

---

## 🚨 Matriz de Incidentes & Procedimentos de Ação

### 1. Fila de Renderização Congestionada (BullMQ Queue Lag)
- **Sintoma:** Alerta de mais de 20 jobs em status `pending` por mais de 5 minutos.
- **Ação:**
  1. Verificar saúde da instância do Redis no Upstash (`redis-cli ping`).
  2. Ajustar auto-scaling do AWS ECS Fargate para elevar contêineres de 1 para 5 workers:
     ```bash
     aws ecs update-service --cluster viral-creator-cluster --service worker-service --desired-count 5
     ```

### 2. Estouro de Cota / Erro de Provedor LLM (OpenRouter / OpenAI)
- **Sintoma:** Exceção `429 Rate Limit` ou `Timeout` na geração de roteiros.
- **Ação:**
  1. O Orquestrador Multi-LLM alterna automaticamente em cascata (OpenRouter -> OpenAI -> Gemini).
  2. Caso todas as chaves estejam esgotadas, adicionar créditos no painel OpenRouter / OpenAI.

### 3. Falha no Envio do YouTube (Copyright / Estouro de Cota 10k)
- **Sintoma:** Erro `quotaExceeded` (10.000 unidades diárias da YouTube API v3 esgotadas).
- **Ação:**
  1. O worker de publicação marca os vídeos restantes como `scheduled` para as 00:00 UTC do dia seguinte.
  2. Nenhuma ação manual é requerida.

---

## 📈 Escalabilidade para 1.000+ Usuários Simultâneos

- **Funções Serverless:** Escalonamento automático transparente na Vercel (limite ajustado para 1.000 instâncias concorrentes).
- **Pool do Banco de Dados:** PgBouncer ativado com limite de 100 conexões pool.
- **Armazenamento S3:** Uploads via Presigned URLs eliminam a passagem de mídia pelo servidor web.
