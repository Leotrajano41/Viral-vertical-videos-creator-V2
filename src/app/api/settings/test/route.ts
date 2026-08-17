import { NextResponse } from "next/server";
import { getConfigValue } from "@/lib/config-resolver";
import axios from "axios";

/**
 * POST /api/settings/test
 * Tests a credential by making a minimal API call to the corresponding service.
 * Body: { key: string }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { key } = body;

    if (!key) {
      return NextResponse.json(
        { error: "Campo 'key' é obrigatório" },
        { status: 400 }
      );
    }

    const value = await getConfigValue(key);

    if (!value) {
      return NextResponse.json(
        { success: false, message: "Chave não configurada" },
        { status: 400 }
      );
    }

    let testResult = { success: false, message: "Teste não implementado para esta chave" };

    switch (key) {
      case "OPENROUTER_API_KEY":
        testResult = await testOpenRouter(value);
        break;
      case "OPENAI_API_KEY":
        testResult = await testOpenAI(value);
        break;
      case "GEMINI_API_KEY":
        testResult = await testGemini(value);
        break;
      case "PEXELS_API_KEY":
        testResult = await testPexels(value);
        break;
      case "PIXABAY_API_KEY":
        testResult = await testPixabay(value);
        break;
      case "ASSEMBLY_API_KEY":
        testResult = await testAssemblyAI(value);
        break;
      default:
        testResult = { success: true, message: "Chave salva (teste automático não disponível)" };
        break;
    }

    return NextResponse.json(testResult);
  } catch (error) {
    console.error("Settings test error:", error);
    return NextResponse.json(
      { success: false, message: "Erro ao testar configuração" },
      { status: 500 }
    );
  }
}

async function testOpenRouter(apiKey: string) {
  try {
    const resp = await axios.get("https://openrouter.ai/api/v1/models", {
      headers: { Authorization: `Bearer ${apiKey}` },
      timeout: 8000,
    });
    if (resp.status === 200) {
      return { success: true, message: `✅ Conectado! ${resp.data.data?.length || 0} modelos disponíveis` };
    }
    return { success: false, message: "Resposta inesperada do OpenRouter" };
  } catch {
    return { success: false, message: "❌ Chave OpenRouter inválida ou expirada" };
  }
}

async function testOpenAI(apiKey: string) {
  try {
    const resp = await axios.get("https://api.openai.com/v1/models", {
      headers: { Authorization: `Bearer ${apiKey}` },
      timeout: 8000,
    });
    if (resp.status === 200) {
      return { success: true, message: `✅ Conectado! ${resp.data.data?.length || 0} modelos disponíveis` };
    }
    return { success: false, message: "Resposta inesperada da OpenAI" };
  } catch {
    return { success: false, message: "❌ Chave OpenAI inválida ou expirada" };
  }
}

async function testGemini(apiKey: string) {
  try {
    const resp = await axios.get(
      `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`,
      { timeout: 8000 }
    );
    if (resp.status === 200) {
      return { success: true, message: `✅ Conectado! ${resp.data.models?.length || 0} modelos disponíveis` };
    }
    return { success: false, message: "Resposta inesperada do Gemini" };
  } catch {
    return { success: false, message: "❌ Chave Gemini inválida ou expirada" };
  }
}

async function testPexels(apiKey: string) {
  try {
    const resp = await axios.get("https://api.pexels.com/v1/search?query=test&per_page=1", {
      headers: { Authorization: apiKey },
      timeout: 8000,
    });
    if (resp.status === 200) {
      return { success: true, message: `✅ Conectado! ${resp.data.total_results} resultados disponíveis` };
    }
    return { success: false, message: "Resposta inesperada do Pexels" };
  } catch {
    return { success: false, message: "❌ Chave Pexels inválida" };
  }
}

async function testPixabay(apiKey: string) {
  try {
    const resp = await axios.get(
      `https://pixabay.com/api/?key=${apiKey}&q=test&per_page=3`,
      { timeout: 8000 }
    );
    if (resp.status === 200) {
      return { success: true, message: `✅ Conectado! ${resp.data.totalHits} resultados` };
    }
    return { success: false, message: "Resposta inesperada do Pixabay" };
  } catch {
    return { success: false, message: "❌ Chave Pixabay inválida" };
  }
}

async function testAssemblyAI(apiKey: string) {
  try {
    const resp = await axios.get("https://api.assemblyai.com/v2/transcript?limit=1", {
      headers: { Authorization: apiKey },
      timeout: 8000,
    });
    if (resp.status === 200) {
      return { success: true, message: "✅ Conectado ao AssemblyAI!" };
    }
    return { success: false, message: "Resposta inesperada" };
  } catch {
    return { success: false, message: "❌ Chave AssemblyAI inválida" };
  }
}
