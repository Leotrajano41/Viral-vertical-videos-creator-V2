import Queue from "bull";
import { processIndexMaterialJob } from "./index-material";
import { processRenderVideoJob } from "./render-video";
import { processPublishYoutubeJob } from "./publish-youtube";

const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";

// Initialize Bull Queues
export const indexMaterialQueue = new Queue("index-material-queue", redisUrl);
export const renderVideoQueue = new Queue("render-video-queue", redisUrl);
export const publishYoutubeQueue = new Queue("publish-youtube-queue", redisUrl);

// 1. Register Worker Handler: Index Material
indexMaterialQueue.process(async (job) => {
  return await processIndexMaterialJob(job.data);
});

// 2. Register Worker Handler: Render Video (Concurrency: 2 parallel renders)
renderVideoQueue.process(2, async (job) => {
  return await processRenderVideoJob(job.data);
});

// 3. Register Worker Handler: Publish YouTube
publishYoutubeQueue.process(async (job) => {
  return await processPublishYoutubeJob(job.data);
});

// Queue Error Handling & Retries
[indexMaterialQueue, renderVideoQueue, publishYoutubeQueue].forEach((queue) => {
  queue.on("failed", (job, err) => {
    console.error(`[BullQueue Error] Job #${job.id} na fila ${queue.name} falhou. Tentativa: ${job.attemptsMade}/${job.opts.attempts}. Erro:`, err.message);
  });

  queue.on("completed", (job, result) => {
    console.log(`[BullQueue Success] Job #${job.id} na fila ${queue.name} concluído com sucesso. Resultado:`, result);
  });
});

console.log("⚡ [Bull Workers Pool] Todos os workers iniciados e escutando a fila Redis!");
