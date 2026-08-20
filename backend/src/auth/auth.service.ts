import { Injectable } from '@nestjs/common';
import { randomBytes, createHash, timingSafeEqual } from 'crypto';
import { DbService } from '../db/db.service';

const TOKEN_BYTES = 32;
const SESSION_DAYS = 30;

@Injectable()
export class AuthService {
  constructor(private db: DbService) {}

  hashPassword(password: string): string {
    const salt = randomBytes(16).toString('hex');
    const iterations = 100000;
    let hash = password;
    for (let i = 0; i < iterations; i++) {
      hash = createHash('sha256').update(salt + hash).digest('hex');
    }
    return `${salt}:${hash}`;
  }

  verifyPassword(password: string, stored: string): boolean {
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

  generateToken(): string {
    return randomBytes(TOKEN_BYTES).toString('hex');
  }

  async createSession(userId: number): Promise<string> {
    const token = this.generateToken();
    const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
    await this.db.createSession(userId, token, expiresAt);
    return token;
  }

  async getUserFromToken(token: string | undefined | null) {
    return this.db.getUserFromToken(token);
  }

  async deleteSession(token: string) {
    await this.db.deleteSession(token);
  }

  async findUserByEmail(email: string) {
    return this.db.findUserByEmail(email);
  }

  async createUser(email: string, name: string, passwordHash: string) {
    return this.db.createUser(email, name, passwordHash);
  }
}
