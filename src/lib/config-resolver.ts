import { prisma } from "./prisma";
import { encrypt, decrypt, maskValue } from "./crypto";

// ─── In-Memory Cache ───
interface CacheEntry {
  value: string;
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 60_000; // 60 seconds

function getCached(key: string): string | null {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.timestamp < CACHE_TTL_MS) {
    return entry.value;
  }
  cache.delete(key);
  return null;
}

function setCache(key: string, value: string): void {
  cache.set(key, { value, timestamp: Date.now() });
}

export function clearConfigCache(): void {
  cache.clear();
}

// ─── Config Definitions ───
export interface ConfigKeyDef {
  key: string;
  label: string;
  category: "llm" | "media" | "storage" | "cache" | "youtube" | "billing";
  placeholder: string;
  validationPattern?: string;
  validationHint?: string;
  isPublic?: boolean; // NEXT_PUBLIC_ vars exposed to frontend
}

export const CONFIG_KEYS: ConfigKeyDef[] = [
  // LLM Providers
  {
    key: "OPENROUTER_API_KEY",
    label: "OpenRouter API Key",
    category: "llm",
    placeholder: "sk-or-v1-...",
    validationPattern: "^sk-or-",
    validationHint: "Deve começar com 'sk-or-'",
  },
  {
    key: "OPENAI_API_KEY",
    label: "OpenAI API Key",
    category: "llm",
    placeholder: "sk-proj-...",
    validationPattern: "^sk-",
    validationHint: "Deve começar com 'sk-'",
  },
  {
    key: "GEMINI_API_KEY",
    label: "Google Gemini API Key",
    category: "llm",
    placeholder: "AIzaSy...",
    validationPattern: "^AIza",
    validationHint: "Deve começar com 'AIza'",
  },

  // Media & Stock
  {
    key: "PEXELS_API_KEY",
    label: "Pexels API Key",
    category: "media",
    placeholder: "Sua chave Pexels",
    validationPattern: "^[a-zA-Z0-9]{15,}$",
    validationHint: "Alfanumérico, mínimo 15 caracteres",
  },
  {
    key: "PIXABAY_API_KEY",
    label: "Pixabay API Key",
    category: "media",
    placeholder: "Sua chave Pixabay",
    validationPattern: "^[a-zA-Z0-9\\-]{10,}$",
    validationHint: "Alfanumérico, mínimo 10 caracteres",
  },
  {
    key: "ASSEMBLY_API_KEY",
    label: "AssemblyAI API Key",
    category: "media",
    placeholder: "Sua chave AssemblyAI",
    validationPattern: "^[a-f0-9]{32}$",
    validationHint: "32 caracteres hexadecimais",
  },

  // AWS S3 Storage
  {
    key: "AWS_REGION",
    label: "AWS Region",
    category: "storage",
    placeholder: "us-east-1",
    validationPattern: "^[a-z]{2}-[a-z]+-\\d+$",
    validationHint: "Ex: us-east-1, eu-west-1",
  },
  {
    key: "AWS_ACCESS_KEY_ID",
    label: "AWS Access Key ID",
    category: "storage",
    placeholder: "AKIA...",
    validationPattern: "^AKIA[A-Z0-9]{16}$",
    validationHint: "Deve começar com 'AKIA', 20 caracteres",
  },
  {
    key: "AWS_SECRET_ACCESS_KEY",
    label: "AWS Secret Access Key",
    category: "storage",
    placeholder: "Sua AWS Secret Key",
    validationPattern: "^[A-Za-z0-9/+=]{30,}$",
    validationHint: "Mínimo 30 caracteres",
  },
  {
    key: "AWS_S3_BUCKET_NAME",
    label: "S3 Bucket Name",
    category: "storage",
    placeholder: "meu-bucket-prod",
    validationPattern: "^[a-z0-9][a-z0-9.\\-]{1,61}[a-z0-9]$",
    validationHint: "Lowercase, sem espaços, 3-63 caracteres",
  },
  {
    key: "NEXT_PUBLIC_CLOUDFRONT_URL",
    label: "CloudFront CDN URL",
    category: "storage",
    placeholder: "https://dxxxxxxx.cloudfront.net",
    validationPattern: "^https://",
    validationHint: "URL HTTPS válida",
    isPublic: true,
  },

  // Redis / Cache
  {
    key: "REDIS_URL",
    label: "Redis Connection URL",
    category: "cache",
    placeholder: "redis://default:token@host:6379",
    validationPattern: "^redis(s)?://",
    validationHint: "Deve começar com 'redis://' ou 'rediss://'",
  },
  {
    key: "UPSTASH_REDIS_REST_URL",
    label: "Upstash REST URL",
    category: "cache",
    placeholder: "https://xxx.upstash.io",
    validationPattern: "^https://",
    validationHint: "URL HTTPS válida",
  },
  {
    key: "UPSTASH_REDIS_REST_TOKEN",
    label: "Upstash REST Token",
    category: "cache",
    placeholder: "Seu Upstash REST Token",
    validationPattern: "^[A-Za-z0-9=+/]{10,}$",
    validationHint: "Token alfanumérico",
  },

  // YouTube & Google OAuth
  {
    key: "GOOGLE_CLIENT_ID",
    label: "Google OAuth Client ID",
    category: "youtube",
    placeholder: "xxxx.apps.googleusercontent.com",
    validationPattern: "\\.apps\\.googleusercontent\\.com$",
    validationHint: "Deve terminar com '.apps.googleusercontent.com'",
  },
  {
    key: "GOOGLE_CLIENT_SECRET",
    label: "Google OAuth Client Secret",
    category: "youtube",
    placeholder: "GOCSPX-...",
    validationPattern: "^GOCSPX-|^[A-Za-z0-9_\\-]{20,}$",
    validationHint: "Formato Google Client Secret",
  },

  // Stripe Billing
  {
    key: "STRIPE_API_KEY",
    label: "Stripe Secret Key",
    category: "billing",
    placeholder: "sk_live_... ou sk_test_...",
    validationPattern: "^sk_(live|test)_",
    validationHint: "Deve começar com 'sk_live_' ou 'sk_test_'",
  },
  {
    key: "STRIPE_WEBHOOK_SECRET",
    label: "Stripe Webhook Secret",
    category: "billing",
    placeholder: "whsec_...",
    validationPattern: "^whsec_",
    validationHint: "Deve começar com 'whsec_'",
  },
  {
    key: "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
    label: "Stripe Publishable Key",
    category: "billing",
    placeholder: "pk_live_... ou pk_test_...",
    validationPattern: "^pk_(live|test)_",
    validationHint: "Deve começar com 'pk_live_' ou 'pk_test_'",
    isPublic: true,
  },
];

// ─── Core Functions ───

/**
 * Gets a config value. Priority: DB (encrypted) > process.env > empty string.
 */
export async function getConfigValue(key: string): Promise<string> {
  // 1. Check cache
  const cached = getCached(key);
  if (cached !== null) return cached;

  // 2. Check DB
  try {
    const setting = await prisma.appSetting.findUnique({ where: { key } });
    if (setting && setting.isConfigured && setting.encryptedValue) {
      const decrypted = decrypt(setting.encryptedValue);
      setCache(key, decrypted);
      return decrypted;
    }
  } catch {
    // DB might not be available yet, fall through to env
  }

  // 3. Fallback to process.env
  const envValue = process.env[key] || "";
  if (envValue) {
    setCache(key, envValue);
  }
  return envValue;
}

/**
 * Saves a config value to the database (encrypted).
 */
export async function setConfigValue(key: string, value: string, category: string): Promise<void> {
  const encryptedValue = encrypt(value);
  await prisma.appSetting.upsert({
    where: { key },
    update: {
      encryptedValue,
      isConfigured: true,
      category,
    },
    create: {
      key,
      encryptedValue,
      category,
      isConfigured: true,
    },
  });
  // Invalidate cache
  cache.delete(key);
}

/**
 * Removes a config value from the database.
 */
export async function removeConfigValue(key: string): Promise<void> {
  try {
    await prisma.appSetting.delete({ where: { key } });
  } catch {
    // Key might not exist, that's ok
  }
  cache.delete(key);
}

export type ConfigSource = "db" | "env" | "none";

export interface ConfigStatus {
  key: string;
  label: string;
  category: string;
  configured: boolean;
  source: ConfigSource;
  maskedValue: string;
  placeholder: string;
  validationPattern?: string;
  validationHint?: string;
  isPublic?: boolean;
}

/**
 * Gets the status of all configurable keys for the Settings UI.
 * NEVER returns actual values — only masked versions.
 */
export async function getAllConfigStatus(): Promise<ConfigStatus[]> {
  // Fetch all DB settings in one query
  let dbSettings: Array<{ key: string; encryptedValue: string; isConfigured: boolean }> = [];
  try {
    dbSettings = await prisma.appSetting.findMany({
      select: { key: true, encryptedValue: true, isConfigured: true },
    });
  } catch {
    // DB might not be available
  }

  const dbMap = new Map(dbSettings.map((s) => [s.key, s]));

  return CONFIG_KEYS.map((def) => {
    const dbSetting = dbMap.get(def.key);

    // Check DB first
    if (dbSetting && dbSetting.isConfigured) {
      try {
        const decrypted = decrypt(dbSetting.encryptedValue);
        return {
          ...def,
          configured: true,
          source: "db" as ConfigSource,
          maskedValue: maskValue(decrypted),
        };
      } catch {
        // Decryption failed, treat as not configured
      }
    }

    // Check process.env
    const envValue = process.env[def.key];
    if (envValue && envValue !== "" && !envValue.startsWith("placeholder")) {
      return {
        ...def,
        configured: true,
        source: "env" as ConfigSource,
        maskedValue: maskValue(envValue),
      };
    }

    return {
      ...def,
      configured: false,
      source: "none" as ConfigSource,
      maskedValue: "",
    };
  });
}
