// AgentShield AI — Zero-Friction Persistent Relational Database Manager
import * as fs from 'fs';
import * as path from 'path';

export interface UserRow {
  id: string;
  email: string;
  password_hash: string;
  role: string;
  tier: 'FREE' | 'PRO' | 'LIFETIME';
  scans_used: number;
  api_key: string;
  created_at: string;
}

export interface SessionRow {
  token: string;
  user_id: string;
  expires_at: string;
}

export interface ScanRow {
  id: string;
  user_id: string;
  prompt_title: string;
  prompt_content: string;
  target_type: string;
  status: string;
  cvss_score: number;
  severity: 'CLEAN' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  vulnerabilities_json: string;
  remediations_json: string;
  execution_time_ms: number;
  created_at: string;
}

export interface WaitlistRow {
  id: string;
  email: string;
  role: string;
  tier: string;
  ip_address: string;
  created_at: string;
}

export interface ProcessedEventRow {
  event_id: string;
  event_type: string;
  processed_at: string;
}

export interface SubscriptionRow {
  id: string;
  user_id: string;
  stripe_customer_id: string;
  stripe_session_id: string;
  plan_tier: string;
  status: string;
  amount_cents: number;
  created_at: string;
}

interface DatabaseStore {
  users: Record<string, UserRow>;
  sessions: Record<string, SessionRow>;
  scans: Record<string, ScanRow>;
  waitlist: Record<string, WaitlistRow>;
  processed_events: Record<string, ProcessedEventRow>;
  subscriptions: Record<string, SubscriptionRow>;
}

export class Database {
  private static dbPath = path.join(process.cwd(), 'data', 'agentshield_store.json');
  private static store: DatabaseStore = {
    users: {},
    sessions: {},
    scans: {},
    waitlist: {},
    processed_events: {},
    subscriptions: {}
  };
  private static initialized = false;

  static initialize(customPath?: string): void {
    if (customPath) {
      this.dbPath = customPath;
    }
    const dir = path.dirname(this.dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    if (fs.existsSync(this.dbPath)) {
      try {
        const raw = fs.readFileSync(this.dbPath, 'utf8');
        this.store = JSON.parse(raw);
      } catch (e) {
        this.save();
      }
    } else {
      this.save();
    }
    this.initialized = true;
  }

  private static save(): void {
    const dir = path.dirname(this.dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const tempPath = `${this.dbPath}.tmp`;
    fs.writeFileSync(tempPath, JSON.stringify(this.store, null, 2), 'utf8');
    fs.renameSync(tempPath, this.dbPath);
  }

  // --- Users Repository ---
  static createUser(user: UserRow): UserRow {
    this.ensureInit();
    // Check uniqueness of email
    const exists = Object.values(this.store.users).some(u => u.email.toLowerCase() === user.email.toLowerCase());
    if (exists) {
      throw new Error('UNIQUE constraint failed: users.email');
    }
    this.store.users[user.id] = user;
    this.save();
    return user;
  }

  static findUserByEmail(email: string): UserRow | null {
    this.ensureInit();
    const clean = email.trim().toLowerCase();
    return Object.values(this.store.users).find(u => u.email.toLowerCase() === clean) || null;
  }

  static findUserById(id: string): UserRow | null {
    this.ensureInit();
    return this.store.users[id] || null;
  }

  static findUserByApiKey(apiKey: string): UserRow | null {
    this.ensureInit();
    return Object.values(this.store.users).find(u => u.api_key === apiKey) || null;
  }

  static updateUserTier(userId: string, tier: 'FREE' | 'PRO' | 'LIFETIME'): boolean {
    this.ensureInit();
    const user = this.store.users[userId];
    if (user) {
      user.tier = tier;
      this.save();
      return true;
    }
    return false;
  }

  static incrementUserScans(userId: string): number {
    this.ensureInit();
    const user = this.store.users[userId];
    if (user) {
      user.scans_used = (user.scans_used || 0) + 1;
      this.save();
      return user.scans_used;
    }
    return 0;
  }

  // --- Sessions Repository ---
  static createSession(session: SessionRow): SessionRow {
    this.ensureInit();
    this.store.sessions[session.token] = session;
    this.save();
    return session;
  }

  static findSession(token: string): (SessionRow & { user?: UserRow }) | null {
    this.ensureInit();
    const session = this.store.sessions[token];
    if (!session) return null;
    if (new Date(session.expires_at) < new Date()) {
      delete this.store.sessions[token];
      this.save();
      return null;
    }
    const user = this.store.users[session.user_id];
    return { ...session, user };
  }

  static deleteSession(token: string): void {
    this.ensureInit();
    if (this.store.sessions[token]) {
      delete this.store.sessions[token];
      this.save();
    }
  }

  // --- Scans Repository ---
  static createScan(scan: ScanRow): ScanRow {
    this.ensureInit();
    this.store.scans[scan.id] = scan;
    this.save();
    return scan;
  }

  static findScansByUserId(userId: string): ScanRow[] {
    this.ensureInit();
    return Object.values(this.store.scans)
      .filter(s => s.user_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  static findScanById(id: string): ScanRow | null {
    this.ensureInit();
    return this.store.scans[id] || null;
  }

  // --- Waitlist Repository ---
  static addWaitlist(entry: WaitlistRow): WaitlistRow {
    this.ensureInit();
    const clean = entry.email.trim().toLowerCase();
    const exists = Object.values(this.store.waitlist).some(w => w.email.toLowerCase() === clean);
    if (exists) {
      throw new Error('Email already registered on waitlist');
    }
    this.store.waitlist[entry.id] = { ...entry, email: clean };
    this.save();
    return this.store.waitlist[entry.id];
  }

  static getWaitlistCount(): number {
    this.ensureInit();
    return Object.keys(this.store.waitlist).length;
  }

  // --- Webhook Idempotency Repository ---
  static isEventProcessed(eventId: string): boolean {
    this.ensureInit();
    return !!this.store.processed_events[eventId];
  }

  static markEventProcessed(eventId: string, eventType: string): void {
    this.ensureInit();
    this.store.processed_events[eventId] = {
      event_id: eventId,
      event_type: eventType,
      processed_at: new Date().toISOString()
    };
    this.save();
  }

  // --- Subscriptions Repository ---
  static createSubscription(sub: SubscriptionRow): SubscriptionRow {
    this.ensureInit();
    this.store.subscriptions[sub.id] = sub;
    this.save();
    return sub;
  }

  // Clean / reset for test isolation
  static resetForTesting(): void {
    this.store = {
      users: {},
      sessions: {},
      scans: {},
      waitlist: {},
      processed_events: {},
      subscriptions: {}
    };
    if (fs.existsSync(this.dbPath)) {
      try { fs.unlinkSync(this.dbPath); } catch (e) {}
    }
    this.initialized = true;
  }

  private static ensureInit(): void {
    if (!this.initialized) {
      this.initialize();
    }
  }
}
