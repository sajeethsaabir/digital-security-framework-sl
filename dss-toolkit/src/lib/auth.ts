import { randomBytes, createHash, timingSafeEqual } from 'crypto';
import { query } from './db';

const TOKEN_BYTES = 32;
const SESSION_DAYS = 30;

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const iterations = 100000;
  let hash = password;
  for (let i = 0; i < iterations; i++) {
    hash = createHash('sha256').update(salt + hash).digest('hex');
  }
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) return false;

  const iterations = 100000;
  let check = password;
  for (let i = 0; i < iterations; i++) {
    check = createHash('sha256').update(salt + check).digest('hex');
  }

  try {
    const hashBuf = Buffer.from(hash, 'hex');
    const checkBuf = Buffer.from(check, 'hex');
    if (hashBuf.length !== checkBuf.length) return false;
    return timingSafeEqual(hashBuf, checkBuf);
  } catch {
    return false;
  }
}

export function generateToken(): string {
  return randomBytes(TOKEN_BYTES).toString('hex');
}

export async function createSession(userId: number): Promise<string> {
  const token = generateToken();
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  await query(
    'INSERT INTO sessions (user_id, token, expires_at) VALUES ($1, $2, $3)',
    [userId, token, expiresAt]
  );
  return token;
}

export async function getUserFromToken(token: string | undefined | null) {
  if (!token) return null;
  if (typeof token !== 'string' || token.length > 128) return null;
  const result = await query(
    `SELECT u.id, u.email, u.name FROM sessions s
     JOIN users u ON s.user_id = u.id
     WHERE s.token = $1 AND s.expires_at > NOW()`,
    [token]
  );
  return result.rows[0] || null;
}

export async function deleteSession(token: string) {
  if (!token || typeof token !== 'string') return;
  await query('DELETE FROM sessions WHERE token = $1', [token]);
}
