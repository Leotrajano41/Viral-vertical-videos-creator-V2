import { test, expect } from "@playwright/test";

test.describe("3. Testes E2E do Fluxo Completo do Usuário (Playwright)", () => {
  test("Fluxo: Descoberta -> + Projeto -> Gerar Ideias -> Fila de Render", async ({ page }) => {
    // 1. Navega para a Dashboard
    await page.goto("http://localhost:3000");
    await expect(page.locator("h1")).toContainText("VIRAL VERTICAL VIDEOS CREATOR");

    // 2. Acessa a página de Descoberta & Trends
    await page.click("text=Descoberta & Trends");
    await expect(page.locator("h1")).toContainText("Descoberta de Assuntos Virais");

    // 3. Executa busca por tendência "GTA 6"
    await page.fill("input[placeholder*='Tema']", "GTA 6");
    await page.click("button:has-text('Buscar')");

    // 4. Cria projeto a partir da tendência
    await page.click("button:has-text('+ Projeto')");
    await expect(page.locator("text=Projeto Criado")).toBeVisible();

    // 5. Navega para a Fila de Renderização
    await page.click("text=Fila de Render");
    await expect(page.locator("h1")).toContainText("Fila de Renderização na Nuvem");
  });
});
