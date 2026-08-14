import { z } from "zod";

// Zod Validation Schemas for the 7 Core API Endpoints

export const TrendsSearchSchema = z.object({
  tema: z.string().min(1, "O tema é obrigatório"),
  source: z.string().optional().default("all"),
  idioma: z.string().optional().default("pt"),
  pais: z.string().optional().default("BR"),
});

export const CreateProjectSchema = z.object({
  name: z.string().min(1, "Nome do projeto é obrigatório"),
  niche: z.string().min(1, "Nicho é obrigatório"),
  theme: z.string().min(1, "Tema é obrigatório"),
  promptMaster: z.string().min(10, "Prompt mestre deve ter no mínimo 10 caracteres"),
  format: z.enum(["9:16", "16:9"]).optional().default("9:16"),
});

export const IndexDocumentSchema = z.object({
  s3Path: z.string().min(1, "O s3Path é obrigatório"),
  fileType: z.enum(["pdf", "docx", "txt", "transcript"]).optional().default("pdf"),
});

export const GenerateIdeasSchema = z.object({
  projectId: z.string().min(1, "ID do projeto é obrigatório"),
});

export const ProduceIdeasSchema = z.object({
  ideaIds: z.array(z.string()).min(1, "Selecione pelo menos uma ideia para produzir"),
});

export const EnqueueRenderJobSchema = z.object({
  projectId: z.string().min(1, "projectId é obrigatório"),
  ideaId: z.string().min(1, "ideaId é obrigatório"),
  priority: z.number().optional().default(10),
});

export const BatchScheduleSchema = z.object({
  videoIds: z.array(z.string()).min(1, "Selecione pelo menos um vídeo para agendar"),
  videosPerDay: z.number().positive().optional().default(2),
  startHour: z.number().min(0).max(23).optional().default(9),
});

describe("Validação de Schemas Zod dos 7 Endpoints Principais", () => {
  test("1. Trends Search - Validação Correta", () => {
    const valid = TrendsSearchSchema.safeParse({ tema: "GTA 6", country: "BR" });
    expect(valid.success).toBe(true);
  });

  test("2. Create Project - Rejeita Prompt Curto", () => {
    const invalid = CreateProjectSchema.safeParse({
      name: "Novo",
      niche: "Tech",
      theme: "IA",
      promptMaster: "curto",
    });
    expect(invalid.success).toBe(false);
  });

  test("3. Index Document - Exige s3Path", () => {
    const valid = IndexDocumentSchema.safeParse({
      s3Path: "s3://bucket/doc.pdf",
      fileType: "pdf",
    });
    expect(valid.success).toBe(true);
  });

  test("4. Batch Schedule - Valida Horário Inicial", () => {
    const valid = BatchScheduleSchema.safeParse({
      videoIds: ["vid_1", "vid_2"],
      videosPerDay: 2,
      startHour: 9,
    });
    expect(valid.success).toBe(true);
  });
});
