import axios from "axios";
import { getConfigValue } from "./config-resolver";

export interface GeneratedIdea {
  title: string;
  description: string;
}

export interface GeneratedScriptPayload {
  hook: string;
  fullScript: string;
  headline: string;
  seo: {
    title: string;
    description: string;
    tags: string[];
  };
}

export class MultiLLMOrchestrator {
  private openRouterKey = "";
  private openAIKey = "";
  private geminiKey = "";
  private initialized = false;

  private async ensureKeys(): Promise<void> {
    if (this.initialized) return;
    this.openRouterKey = await getConfigValue("OPENROUTER_API_KEY");
    this.openAIKey = await getConfigValue("OPENAI_API_KEY");
    this.geminiKey = await getConfigValue("GEMINI_API_KEY");
    this.initialized = true;
    // Re-init after 60s to pick up config changes
    setTimeout(() => { this.initialized = false; }, 60_000);
  }

  async generateIdeas(masterPrompt: string, theme: string, contextRAG: string = ""): Promise<GeneratedIdea[]> {
    const prompt = `
${masterPrompt}

[MATERIAL DE ESTUDO INDEXADO RAG]
${contextRAG}

[TEMA PRINCIPAL]
${theme}

RETORNE EXATAMENTE UM JSON VALIDO COM UM ARRAY DE 10 IDEIAS VIRIAIS:
{
  "ideas": [
    {"title": "Título da Ideia 1", "description": "Descrição breve 1"}
  ]
}
`;
    try {
      const responseText = await this._callFallbackCascade(prompt);
      const parsed = JSON.parse(responseText);
      return parsed.ideas || this._getFallbackIdeas(theme);
    } catch {
      return this._getFallbackIdeas(theme);
    }
  }

  async generateScriptAndSEO(masterPrompt: string, ideaTitle: string, ideaDescription: string, contextRAG: string = ""): Promise<GeneratedScriptPayload> {
    const prompt = `
${masterPrompt}

[IDEIA SELECIONADA]
Título: ${ideaTitle}
Descrição: ${ideaDescription}

[MATERIAL DE ESTUDO INDEXADO RAG]
${contextRAG}

RETORNE EXATAMENTE UM JSON VALIDO COM O ROTEIRO COMPLETO PARA NARRAÇÃO, HEADLINE E SEO:
{
  "hook": "Frase de impacto inicial (0-3s)",
  "fullScript": "Texto completo narrado de forma contínua para narração (25-40s)",
  "headline": "TEXTO CURTO EM CAIXA ALTA PARA TOPO DO VÍDEO",
  "seo": {
    "title": "Título otimizado para o YouTube Shorts com Hashtags",
    "description": "Descrição envolvente com hashtags",
    "tags": ["tag1", "tag2", "tag3"]
  }
}
`;
    try {
      const responseText = await this._callFallbackCascade(prompt);
      const parsed = JSON.parse(responseText);
      return parsed;
    } catch {
      return {
        hook: `Você sabia disso sobre ${ideaTitle}?`,
        fullScript: `Você sabia disso sobre ${ideaTitle}? ${ideaDescription}. Isso muda completamente nosso entendimento. Deixe seu comentário e siga para mais novidades!`,
        headline: `${ideaTitle.toUpperCase().slice(0, 25)}!`,
        seo: {
          title: `${ideaTitle} - Revelado! #shorts`,
          description: ideaDescription,
          tags: [ideaTitle, "curiosidades", "viral", "shorts"],
        },
      };
    }
  }

  private async _callFallbackCascade(prompt: string): Promise<string> {
    await this.ensureKeys();

    // 1. Try OpenRouter (Primary)
    if (this.openRouterKey) {
      try {
        const resp = await axios.post(
          "https://openrouter.ai/api/v1/chat/completions",
          {
            model: "deepseek/deepseek-chat",
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" },
          },
          { headers: { Authorization: `Bearer ${this.openRouterKey}` }, timeout: 15000 }
        );
        return resp.data.choices[0].message.content;
      } catch (e) {
        // Fallback to secondary
      }
    }

    // 2. Try OpenAI (Secondary)
    if (this.openAIKey) {
      try {
        const resp = await axios.post(
          "https://api.openai.com/v1/chat/completions",
          {
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" },
          },
          { headers: { Authorization: `Bearer ${this.openAIKey}` }, timeout: 15000 }
        );
        return resp.data.choices[0].message.content;
      } catch (e) {
        // Fallback to tertiary
      }
    }

    throw new Error("Provedores de LLM offline ou sem API key configurada");
  }

  private _getFallbackIdeas(theme: string): GeneratedIdea[] {
    return Array.from({ length: 10 }).map((_, i) => ({
      title: `Ideia Viral #${i + 1} sobre ${theme}`,
      description: `Uma abordagem surpreendente e cheia de retenção focada em revelar os maiores mistérios de ${theme}.`,
    }));
  }
}

export const llmOrchestrator = new MultiLLMOrchestrator();
