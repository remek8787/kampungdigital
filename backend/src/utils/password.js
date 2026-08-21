import bcrypt from "bcryptjs";
import crypto from "crypto";

const BCRYPT_ROUNDS = Number.parseInt(process.env.BCRYPT_ROUNDS || "12", 10);
const MD5_PATTERN = /^[a-f0-9]{32}$/i;

export const hashPassword = (password) => bcrypt.hash(password, BCRYPT_ROUNDS);

export const verifyPassword = async (password, storedHash) => {
  if (!storedHash) return { valid: false, needsUpgrade: false };
  if (/^\$2[aby]\$/.test(storedHash)) {
    return { valid: await bcrypt.compare(password, storedHash), needsUpgrade: false };
  }
  if (MD5_PATTERN.test(storedHash)) {
    const legacyHash = crypto.createHash("md5").update(password).digest("hex");
    const valid = crypto.timingSafeEqual(Buffer.from(legacyHash), Buffer.from(storedHash.toLowerCase()));
    return { valid, needsUpgrade: valid };
  }
  const left = Buffer.from(String(password));
  const right = Buffer.from(String(storedHash));
  const valid = left.length === right.length && crypto.timingSafeEqual(left, right);
  return { valid, needsUpgrade: valid };
};
