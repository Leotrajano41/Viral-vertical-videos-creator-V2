import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { decryptWithIv } from "@/lib/crypto";
import { getConfigValue } from "@/lib/config-resolver";
import axios from "axios";

const PROVIDER_MAP: Record<string, { key: string; label: string }> = {
  openai: { key: "OPENAI_API_KEY", label: "OpenAI" },
  assemblyai: { key: "ASSEMBLY_API_KEY", label: "AssemblyAI" },
  pexels: { key: "PEXELS_API_KEY", label: "Pexels" },
  pixabay: { key: "PIXABAY_API_KEY", label: "Pixabay" },
};

/**
 * POST /api/settings/api-keys/:provider/test
 * Decrypts the key, performs a live test, updates last_tested_at / is_valid in DB, and returns the result.
 */
export async function POST(
  request: Request,
  { params }: { params: { provider: string } }
) {
  try {
    const provider = params.provider?.toLowerCase();
    const providerInfo = PROVIDER_MAP[provider];

    if (!providerInfo) {
      return NextResponse.json(
        { valid: false, message: `Provedor '${provider}' não suportado` },
        { status: 400 }
      );
    }

    let apiKey = "";

    // 1. Try to find userApiKey in DB
    const user = await prisma.user.findFirst();
    if (user) {
      const userKey = await prisma.userApiKey.findUnique({
        where: {
          userId_provider: {
            userId: user.id,
            provider,
          },
        },
      });

      if (userKey && userKey.encryptedKey && userKey.encryptionIv) {
        try {
          apiKey = decryptWithIv(userKey.encryptedKey, userKey.encryptionIv);
        } catch {
          apiKey = "";
        }
      }
    }

    // 2. Fallback to config resolver
    if (!apiKey) {
      apiKey = (await getConfigValue(providerInfo.key)) || "";
    }

    if (!apiKey || apiKey.trim() === "" || apiKey.startsWith("placeholder")) {
      return NextResponse.json(
        { valid: false, message: "Chave não configurada ou vazia" },
        { status: 400 }
      );
    }

    // 3. Perform live API test
    let testResult = { valid: false, message: "Falha ao validar chave" };

    switch (provider) {
      case "openai":
        testResult = await testOpenAI(apiKey);
        break;
      case "assemblyai":
        testResult = await testAssemblyAI(apiKey);
        break;
      case "pexels":
        testResult = await testPexels(apiKey);
        break;
      case "pixabay":
        testResult = await testPixabay(apiKey);
        break;
      default:
        testResult = { valid: true, message: "Chave salva com sucesso" };
    }

    // 4. Update last_tested_at and is_valid in DB if userKey exists
    if (user) {
      try {
        await prisma.userApiKey.updateMany({
          where: {
            userId: user.id,
            provider,
          },
          data: {
            isValid: testResult.valid,
            lastTestedAt: new Date(),
          },
        });
      } catch (err) {
        console.error("Failed to update test timestamp:", err);
      }
    }

    return NextResponse.json(testResult);
  } catch (error: any) {
    console.error(`API key test error for ${params.provider}:`, error);
    return NextResponse.json(
      { valid: false, message: "✗ Chave inválida ou serviço indisponível" },
      { status: 500 }
    );
  }
}

async function testOpenAI(apiKey: string) {
  try {
    const resp = await axios.get("https://api.openai.com/v1/models", {
      headers: { Authorization: `Bearer ${apiKey}` },
      timeout: 8000,
    });
    if (resp.status === 200) {
      return { valid: true, message: "✓ Chave válida!" };
    }
    return { valid: false, message: "✗ Chave inválida ou resposta inesperada" };
  } catch {
    return { valid: false, message: "✗ Chave inválida ou serviço indisponível" };
  }
}

async function testAssemblyAI(apiKey: string) {
  try {
    const resp = await axios.get("https://api.assemblyai.com/v2/transcript?limit=1", {
      headers: { Authorization: apiKey },
      timeout: 8000,
    });
    if (resp.status === 200) {
      return { valid: true, message: "✓ Chave válida!" };
    }
    return { valid: false, message: "✗ Chave inválida ou resposta inesperada" };
  } catch {
    return { valid: false, message: "✗ Chave inválida ou serviço indisponível" };
  }
}

async function testPexels(apiKey: string) {
  try {
    const resp = await axios.get("https://api.pexels.com/v1/search?query=nature&per_page=1", {
      headers: { Authorization: apiKey },
      timeout: 8000,
    });
    if (resp.status === 200) {
      return { valid: true, message: "✓ Chave válida!" };
    }
    return { valid: false, message: "✗ Chave inválida ou resposta inesperada" };
  } catch {
    return { valid: false, message: "✗ Chave inválida ou serviço indisponível" };
  }
}

async function testPixabay(apiKey: string) {
  try {
    const resp = await axios.get(`https://pixabay.com/api/?key=${apiKey}&q=nature&per_page=3`, {
      timeout: 8000,
    });
    if (resp.status === 200) {
      return { valid: true, message: "✓ Chave válida!" };
    }
    return { valid: false, message: "✗ Chave inválida ou resposta inesperada" };
  } catch {
    return { valid: false, message: "✗ Chave inválida ou serviço indisponível" };
  }
}
