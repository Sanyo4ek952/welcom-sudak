import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback);

const KEY_LENGTH = 64;

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = (await scrypt(password, salt, KEY_LENGTH)) as Buffer;
  return `scrypt$${salt}$${derivedKey.toString("hex")}`;
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  if (!storedHash.startsWith("scrypt$")) {
    return false;
  }

  const [, salt, hashHex] = storedHash.split("$");
  if (!salt || !hashHex) {
    return false;
  }

  const keyBuffer = Buffer.from(hashHex, "hex");
  const candidate = (await scrypt(password, salt, keyBuffer.length)) as Buffer;
  if (candidate.length !== keyBuffer.length) {
    return false;
  }

  return timingSafeEqual(candidate, keyBuffer);
}
