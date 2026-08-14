import { ViralityScorer } from "../../src/lib/virality-scorer";
import { SemanticTextChunker } from "../../src/lib/semantic-chunker";
import { SmartScheduler } from "../../src/lib/smart-scheduler";
import { llmOrchestrator } from "../../src/lib/llm-orchestrator";

describe("1. Testes Unitários de Funções Críticas do Sistema", () => {
  test("ViralityScorer: Calcula Virality Index com momentum", () => {
    const score = ViralityScorer.calculate_score(50000, Date.now() / 1000 - 3600 * 2, 0.4, 1.2);
    expect(score).toBeGreaterThan(100);
  });

  test("SemanticTextChunker: Divide texto mantendo janela de sobreposição", () => {
    const chunker = new SemanticTextChunker(100, 20);
    const text = "Primeira frase curta. Segunda frase com mais detalhes. Terceira frase para fechar o teste semântico.";
    const chunks = chunker.split_text(text);
    expect(chunks.length).toBeGreaterThan(0);
  });

  test("SmartScheduler: Reagenda postagens na madrugada para 06:00 AM", () => {
    const videoIds = ["vid_101"];
    const slots = SmartScheduler.calculateBatchSlots(videoIds, 1, 23, 22);
    expect(slots[0].scheduledAt.getHours()).toBe(6);
    expect(slots[0].warning).toContain("06:00 AM");
  });

  test("MultiLLMOrchestrator: Retorna 10 ideias formato JSON", async () => {
    const ideas = await llmOrchestrator.generateIdeas("Prompt Mestre", "GTA 6");
    expect(ideas.length).toBe(10);
    expect(ideas[0]).toHaveProperty("title");
    expect(ideas[0]).toHaveProperty("description");
  });
});
