import bcryptjs from "bcryptjs";

const SALT_ROUNDS = 12; // OWASP 2024 sweet spot

/**
 * Hash password ด้วย bcrypt cost 12
 * @param plain - password ดิบจาก user
 * @returns hash string ในรูป $2b$12$...
 */
export async function hashPassword(plain: string): Promise<string> {
  return await bcryptjs.hash(plain, SALT_ROUNDS);
}

/**
 * Verify password ที่ user กรอก กับ hash ใน DB
 * @param plain - password ที่ user เพิ่งพิมพ์
 * @param hash - hash ที่เก็บใน DB
 * @returns true ถ้าตรงกัน, false ถ้าไม่ตรง
 */
export async function verifyPassword(
  plain: string,
  hash: string,
): Promise<boolean> {
  return await bcryptjs.compare(plain, hash);
}
