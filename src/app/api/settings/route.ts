import { NextResponse } from "next/server";
import {
  getAllConfigStatus,
  setConfigValue,
  removeConfigValue,
  CONFIG_KEYS,
  clearConfigCache,
} from "@/lib/config-resolver";

/**
 * GET /api/settings
 * Returns the status of all configurable keys (never returns actual values).
 */
export async function GET() {
  try {
    const statuses = await getAllConfigStatus();
    return NextResponse.json({ settings: statuses });
  } catch (error) {
    console.error("Failed to fetch settings:", error);
    return NextResponse.json(
      { error: "Erro ao carregar configurações" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/settings
 * Saves an encrypted credential to the database.
 * Body: { key: string, value: string }
 */
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { key, value } = body;

    if (!key || !value) {
      return NextResponse.json(
        { error: "Campos 'key' e 'value' são obrigatórios" },
        { status: 400 }
      );
    }

    // Validate key exists in our definitions
    const keyDef = CONFIG_KEYS.find((k) => k.key === key);
    if (!keyDef) {
      return NextResponse.json(
        { error: `Chave '${key}' não é uma configuração válida` },
        { status: 400 }
      );
    }

    // Validate format if pattern exists
    if (keyDef.validationPattern) {
      const regex = new RegExp(keyDef.validationPattern);
      if (!regex.test(value)) {
        return NextResponse.json(
          {
            error: `Formato inválido para ${keyDef.label}`,
            hint: keyDef.validationHint,
          },
          { status: 400 }
        );
      }
    }

    // Encrypt and save
    await setConfigValue(key, value, keyDef.category);
    clearConfigCache();

    return NextResponse.json({
      success: true,
      message: `${keyDef.label} salva com sucesso`,
    });
  } catch (error) {
    console.error("Failed to save setting:", error);
    return NextResponse.json(
      { error: "Erro ao salvar configuração" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/settings?key=OPENROUTER_API_KEY
 * Removes a credential from the database (falls back to env).
 */
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");

    if (!key) {
      return NextResponse.json(
        { error: "Parâmetro 'key' é obrigatório" },
        { status: 400 }
      );
    }

    await removeConfigValue(key);
    clearConfigCache();

    return NextResponse.json({
      success: true,
      message: `Configuração '${key}' removida. Usando fallback (env) se disponível.`,
    });
  } catch (error) {
    console.error("Failed to delete setting:", error);
    return NextResponse.json(
      { error: "Erro ao remover configuração" },
      { status: 500 }
    );
  }
}
