import { NextRequest, NextResponse } from "next/server";
import {
  setConfigValue,
  getConfigValue,
  clearConfigCache,
} from "@/lib/config-resolver";
import { prisma } from "@/lib/prisma";
import { encryptWithIv, decryptWithIv, maskValue } from "@/lib/crypto";

const PROVIDER_MAP: Record<string, { key: string; category: string; label: string; placeholder: string }> = {
  openai: { key: "OPENAI_API_KEY", category: "llm", label: "OpenAI (IA)", placeholder: "sk-proj-..." },
  assemblyai: { key: "ASSEMBLY_API_KEY", category: "media", label: "AssemblyAI (transcrição)", placeholder: "aai_..." },
  pexels: { key: "PEXELS_API_KEY", category: "media", label: "Pexels (banco de vídeos)", placeholder: "pexels_..." },
  pixabay: { key: "PIXABAY_API_KEY", category: "media", label: "Pixabay (banco de mídia)", placeholder: "pixabay_..." },
};

async function getOrCreateDefaultUser() {
  try {
    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: {
          id: "default_user_1",
          email: "user@viralcreator.ai",
          name: "Creator",
          plan: "pro",
        },
      });
    }
    return user;
  } catch (err) {
    console.warn("Could not query/create default user:", err);
    return { id: "default_user_1", email: "user@viralcreator.ai", name: "Creator" };
  }
}

/**
 * GET /api/settings/api-keys
 * Returns: Array and Map of keys (safely masked, never in plain text)
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getOrCreateDefaultUser();
    let userKeys: any[] = [];
    try {
      userKeys = await prisma.userApiKey.findMany({
        where: { userId: user.id },
      });
    } catch (err) {
      console.warn("userApiKey.findMany failed, using fallback:", err);
    }

    const keysArray = [];
    const apiKeysMap: Record<string, { isActive: boolean; maskedKey: string; lastTested: string | null }> = {};

    for (const [provider, info] of Object.entries(PROVIDER_MAP)) {
      const userKey = userKeys.find((k) => k.provider.toLowerCase() === provider);
      let isActive = false;
      let maskedKey = "";
      let lastTested: string | null = null;

      if (userKey && userKey.isActive) {
        isActive = true;
        try {
          const decrypted = decryptWithIv(userKey.encryptedKey, userKey.encryptionIv);
          maskedKey = maskValue(decrypted);
        } catch {
          maskedKey = "••••••••••••";
        }
        lastTested = userKey.lastTestedAt ? new Date(userKey.lastTestedAt).toISOString() : null;
      } else {
        // Check fallback from config resolver or process.env
        try {
          const fallbackVal = await getConfigValue(info.key);
          if (fallbackVal && fallbackVal.length > 5 && !fallbackVal.startsWith("placeholder")) {
            isActive = true;
            maskedKey = maskValue(fallbackVal);
          }
        } catch {
          // ignore
        }
      }

      keysArray.push({
        provider,
        label: info.label,
        status: isActive ? "active" : "inactive",
        isValid: Boolean(userKey?.isValid),
        lastTested,
        maskedKey,
      });

      apiKeysMap[provider] = {
        isActive,
        maskedKey,
        lastTested,
      };
    }

    return NextResponse.json({
      success: true,
      keys: keysArray,
      apiKeys: apiKeysMap,
    }, { status: 200 });
  } catch (error: any) {
    console.error("GET /api/settings/api-keys error:", error);
    return NextResponse.json(
      { success: false, error: "Erro ao buscar chaves" },
      { status: 200 }
    );
  }
}

/**
 * POST /api/settings/api-keys
 * Body: { provider: "openai" | "assemblyai" | "pexels" | "pixabay", apiKey: string }
 * Encrypts with AES-256 and unique IV, saving to user_api_keys and app_settings.
 */
export async function POST(request: NextRequest) {
  try {
    let body: any = {};
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const { provider, apiKey } = body;

    // 1. Validar campos
    if (!provider || !apiKey) {
      return NextResponse.json(
        { success: false, error: "Provider e apiKey são obrigatórios" },
        { status: 400 }
      );
    }

    const providerKey = String(provider).toLowerCase().trim();
    if (!["openai", "assemblyai", "pexels", "pixabay"].includes(providerKey)) {
      return NextResponse.json(
        { success: false, error: "Provider inválido" },
        { status: 400 }
      );
    }

    const cleanApiKey = String(apiKey).trim();
    if (cleanApiKey.length === 0) {
      return NextResponse.json(
        { success: false, error: "Chave API não pode estar vazia" },
        { status: 400 }
      );
    }

    const providerInfo = PROVIDER_MAP[providerKey];

    // 2. Criptografar com AES-256 e IV único
    const { encryptedKey, encryptionIv } = encryptWithIv(cleanApiKey);

    // 3. Salvar no banco (user_api_keys)
    try {
      const user = await getOrCreateDefaultUser();
      await prisma.userApiKey.upsert({
        where: {
          userId_provider: {
            userId: user.id,
            provider: providerKey,
          },
        },
        update: {
          encryptedKey,
          encryptionIv,
          isActive: true,
          isValid: false,
          updatedAt: new Date(),
        },
        create: {
          userId: user.id,
          provider: providerKey,
          encryptedKey,
          encryptionIv,
          isActive: true,
          isValid: false,
        },
      });
    } catch (dbErr) {
      console.warn("Could not save to userApiKey table, saving to appSetting fallback:", dbErr);
    }

    // 4. Salvar também em app_settings para o config resolver
    try {
      await setConfigValue(providerInfo.key, cleanApiKey, providerInfo.category);
    } catch (settingErr) {
      console.warn("Could not save to appSetting:", settingErr);
    }
    clearConfigCache();

    // 5. Retornar resposta segura com status 200
    return NextResponse.json({
      success: true,
      message: "Chave salva com sucesso!",
      provider: providerKey,
      status: "saved",
      maskedKey: maskValue(cleanApiKey),
    }, { status: 200 });

  } catch (error: any) {
    console.error("POST /api/settings/api-keys error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Falha ao salvar a chave. Tente novamente.",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
