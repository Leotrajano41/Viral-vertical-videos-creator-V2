import crypto from "crypto";

const ALGORITHM = "aes-256-cbc";
const IV_LENGTH = 16;

function getEncryptionKey(): Buffer {
  const key = process.env.AES_SECRET_KEY || "006552e14574a3c1047ccf8e5553a7e9";
  // AES-256 requires a 32-byte key. Our hex key is 16 bytes, so we hash it to get 32 bytes.
  return crypto.createHash("sha256").update(key).digest();
}

/**
 * Encrypts a plaintext string using AES-256-CBC.
 * Returns a string in the format: "iv_hex:encrypted_hex"
 */
export function encrypt(plaintext: string): string {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(plaintext, "utf8", "hex");
  encrypted += cipher.final("hex");
  return `${iv.toString("hex")}:${encrypted}`;
}

/**
 * Decrypts a ciphertext string (format: "iv_hex:encrypted_hex") using AES-256-CBC.
 * Returns the original plaintext.
 */
export function decrypt(ciphertext: string): string {
  const key = getEncryptionKey();
  const [ivHex, encryptedHex] = ciphertext.split(":");
  if (!ivHex || !encryptedHex) {
    throw new Error("Invalid ciphertext format. Expected 'iv:encrypted'.");
  }
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  let decrypted = decipher.update(encryptedHex, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

/**
 * Masks a credential value for safe display.
 * Shows first 6 and last 4 characters, with **** in between.
 */
export function maskValue(value: string): string {
  if (value.length <= 12) return "****";
  return `${value.slice(0, 6)}****${value.slice(-4)}`;
}
