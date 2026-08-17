import { NextResponse } from "next/server";
import {
  setConfigValue,
  getConfigValue,
  removeConfigValue,
  clearConfigCache,
} from "@/lib/config-resolver";
import { prisma } from "@/lib/prisma";
import { decrypt, maskValue } from "@/lib/crypto";

const PROVIDER_MAP: Record<string, { key: string; category: string; label: string }> = {
  openai: { key: "OPENAI_API_KEY", category: "llm", label: "OpenAI" },
  assemblyai: { key: "ASSEMBLY_API_KEY", category: "media", label: "AssemblyAI" },
  pexels: { key: "PEXELS_API_KEY", category: "media", label: "Pexels" },
  pixabay: { key: "PIXABAY_API_KEY", category: "media", label: "Pixabay" },
};

/**
 * GET /api/settings/api-keys
 * Returns the active status and masked value of the 4 main API keys.
 */
export async function GET() {
  try {
    const results: Record<string, { isActive: boolean; maskedKey: string }> = {};

    for (const [provider, info] of Object.entries(PROVIDER_MAP)) {
      const val = await getConfigValue(info.key);
      const isActive = Boolean(val && val.length > 5 && !val.startsWith("placeholder"));
      results[provider] = {
        isActive,
        maskedKey: isActive ? maskValue(val) : "",
      };
    }

    return NextResponse.json({ status: "SUCCESS", apiKeys: results });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Erro ao buscar chaves" }, { status: 500 });
  }
}

/**
 * POST /api/settings/api-keys
 * Body: { provider: "openai" | "assemblyai" | "pexels" | "pixabay", apiKey: string }
 * Encrypts and stores the key securely in the database.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { provider, apiKey } = body;

    if (!provider || !apiKey) {
      return NextResponse.json(
        { error: "Os campos 'provider' e 'apiKey' são obrigatórios" },
        { status: 400 }
      );
    }

    const providerInfo = PROVIDER_MAP[provider.toLowerCase()];
    if (!providerInfo) {
      return NextResponse.json(
        { error: `Provedor '${provider}' não suportado` },
        { status: 400 }
      );
    }

    // Encrypt and save to database
    await setConfigValue(providerInfo.key, apiKey.trim(), providerInfo.category);
    clearConfigCache();

    return NextResponse.json({
      status: "SUCCESS",
      message: `✓ Chave ${providerInfo.label} salva com sucesso!`,
      provider,
    });
  } catch (error: any) {
    console.error("API Key save error:", error);
    return NextResponse.json(
      { error: "✗ Falha ao salvar. Verifique a chave." },
      { status: 500 }
    );
  }
}
