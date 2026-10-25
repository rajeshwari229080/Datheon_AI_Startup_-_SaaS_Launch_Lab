// AgentShield AI — Authentication & Cryptographic Session Service
import * as crypto from 'crypto';
import { Database, UserRow, SessionRow } from '../db/database';

export class AuthService {
  // Cryptographically secure password hashing using PBKDF2 with 100,000 iterations
  static hashPassword(password: string): string {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
    return `${salt}:${hash}`;
  }

  static verifyPassword(password: string, storedHash: string): boolean {
    const [salt, originalHash] = storedHash.split(':');
    if (!salt || !originalHash) return false;
    const testHash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
    return crypto.timingSafeEqual(Buffer.from(originalHash, 'hex'), Buffer.from(testHash, 'hex'));
  }

  static register(email: string, password: string, role = 'developer'): { user: Omit<UserRow, 'password_hash'>; token: string } {
    if (!email || !password || password.length < 8) {
      throw new Error('Email must be valid and password must be at least 8 characters long.');
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = Database.findUserByEmail(cleanEmail);
    if (existing) {
      throw new Error('An account with this email already exists.');
    }

    const userId = `usr_${crypto.randomBytes(8).toString('hex')}`;
    const apiKey = `ash_${crypto.randomBytes(24).toString('hex')}`;
    const passwordHash = this.hashPassword(password);

    const newUser: UserRow = {
      id: userId,
      email: cleanEmail,
      password_hash: passwordHash,
      role,
      tier: 'FREE',
      scans_used: 0,
      api_key: apiKey,
      created_at: new Date().toISOString()
    };

    Database.createUser(newUser);

    // Create initial session token
    const token = this.createSessionToken(userId);

    const { password_hash, ...safeUser } = newUser;
    return { user: safeUser, token };
  }

  static login(email: string, password: string): { user: Omit<UserRow, 'password_hash'>; token: string } {
    const cleanEmail = email.trim().toLowerCase();
    const user = Database.findUserByEmail(cleanEmail);
    if (!user) {
      throw new Error('Invalid email or password.');
    }

    const valid = this.verifyPassword(password, user.password_hash);
    if (!valid) {
      throw new Error('Invalid email or password.');
    }

    const token = this.createSessionToken(user.id);
    const { password_hash, ...safeUser } = user;
    return { user: safeUser, token };
  }

  static createSessionToken(userId: string): string {
    const token = `sess_${crypto.randomBytes(24).toString('hex')}`;
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days

    const session: SessionRow = {
      token,
      user_id: userId,
      expires_at: expiresAt
    };

    Database.createSession(session);
    return token;
  }

  static validateSession(token: string): Omit<UserRow, 'password_hash'> | null {
    if (!token) return null;
    const session = Database.findSession(token);
    if (!session || !session.user) return null;
    const { password_hash, ...safeUser } = session.user;
    return safeUser;
  }

  static validateApiKey(apiKey: string): Omit<UserRow, 'password_hash'> | null {
    if (!apiKey) return null;
    const user = Database.findUserByApiKey(apiKey);
    if (!user) return null;
    const { password_hash, ...safeUser } = user;
    return safeUser;
  }
}
