import { POST as searchTrends } from "../../src/app/api/trends/search/route";
import { POST as generateIdeas } from "../../src/app/api/ideas/generate/route";

describe("2. Testes de Integração de Endpoints REST Serverless", () => {
  test("POST /api/trends/search - Retorna lista de tendências", async () => {
    const req = new Request("http://localhost:3000/api/trends/search", {
      method: "POST",
      body: JSON.stringify({ tema: "GTA 6", country: "BR" }),
    });
    const res = await searchTrends(req);
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.status).toBe("SUCCESS");
    expect(data.trends.length).toBeGreaterThan(0);
  });

  test("POST /api/ideas/generate - Rejeita requisição sem projectId", async () => {
    const req = new Request("http://localhost:3000/api/ideas/generate", {
      method: "POST",
      body: JSON.stringify({}),
    });
    const res = await generateIdeas(req);
    expect(res.status).toBe(400);
  });
});
