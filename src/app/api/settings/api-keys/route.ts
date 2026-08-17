import { NextResponse } from "next/server";
import {
  setConfigValue,
  getConfigValue,
  clearConfigCache,
} from "@/lib/config-resolver";
import { prisma } from "@/lib/prisma";
import { encryptWithIv, decryptWithIv, maskValue } from "@/lib/crypto";

const PROVIDER_MAP: Record<string, { key: string; category: string; label: string }> = {
  openai: { key: "OPENAI_API_KEY", category: "llm", label: "OpenAI" },
  assemblyai: { key: "ASSEMBLY_API_KEY", category: "media", label: "AssemblyAI" },
  pexels: { key: "PEXELS_API_KEY", category: "media", label: "Pexels" },
  pixabay: { key: "PIXABAY_API_KEY", category: "media", label: "Pixabay" },
};

async function getOrCreateDefaultUser() {
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
}

/**
 * GET /api/settings/api-keys
 * Returns: Array and Map of keys (safely masked, never in plain text)
 */
export async function GET() {
  try {
    const user = await getOrCreateDefaultUser();
    const userKeys = await prisma.userApiKey.findMany({
      where: { userId: user.id },
    });

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
        lastTested = userKey.lastTestedAt?.toISOString() || null;
      } else {
        // Check fallback from config resolver
        const fallbackVal = await getConfigValue(info.key);
        if (fallbackVal && fallbackVal.length > 5 && !fallbackVal.startsWith("placeholder")) {
          isActive = true;
          maskedKey = maskValue(fallbackVal);
        }
      }

      keysArray.push({
        provider,
        label: info.label,
        status: isActive ? "active" : "inactive",
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
    });
  } catch (error: any) {
    console.error("GET /api/settings/api-keys error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Erro ao buscar chaves" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/settings/api-keys
 * Body: { provider: "openai" | "assemblyai" | "pexels" | "pixabay", apiKey: string }
 * Encrypts with AES-256 and unique IV, saving to user_api_keys and app_settings.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { provider, apiKey } = body;

    // 1. Validar
    if (!provider || !apiKey || apiKey.trim() === "") {
      return NextResponse.json(
        { success: false, error: "Chave API não pode estar vazia" },
        { status: 400 }
      );
    }

    const providerKey = provider.toLowerCase();
    const providerInfo = PROVIDER_MAP[providerKey];
    if (!providerInfo) {
      return NextResponse.json(
        { success: false, error: `Provedor '${provider}' não suportado` },
        { status: 400 }
      );
    }

    const user = await getOrCreateDefaultUser();
    const cleanApiKey = apiKey.trim();

    // 2. Criptografar com AES-256 e IV único
    const { encryptedKey, encryptionIv } = encryptWithIv(cleanApiKey);

    // 3. Salvar no banco (user_api_keys)
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

    // 4. Salvar também em app_settings para interoperabilidade do config resolver
    await setConfigValue(providerInfo.key, cleanApiKey, providerInfo.category);
    clearConfigCache();

    // 5. Retornar sucesso seguro
    return NextResponse.json({
      success: true,
      provider: providerKey,
      maskedKey: maskValue(cleanApiKey),
      message: `✓ Chave ${providerInfo.label} salva com sucesso!`,
    });
  } catch (error: any) {
    console.error("POST /api/settings/api-keys error:", error);
    return NextResponse.json(
      { success: false, error: "✗ Falha ao salvar. Verifique a chave." },
      { status: 500 }
    );
  }
}
