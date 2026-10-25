-- AgentShield AI Relational Database Schema
-- Compatible with SQLite3, PostgreSQL, and Supabase

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'developer',
  tier TEXT DEFAULT 'FREE', -- FREE, PRO, LIFETIME
  scans_used INTEGER DEFAULT 0,
  api_key TEXT UNIQUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  expires_at DATETIME NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS scans (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  prompt_title TEXT NOT NULL,
  prompt_content TEXT NOT NULL,
  target_type TEXT DEFAULT 'system_prompt', -- system_prompt, rag_context, tool_schema
  status TEXT DEFAULT 'completed',
  cvss_score REAL DEFAULT 0.0,
  severity TEXT DEFAULT 'CLEAN', -- CLEAN, LOW, MEDIUM, HIGH, CRITICAL
  vulnerabilities_json TEXT DEFAULT '[]',
  remediations_json TEXT DEFAULT '[]',
  execution_time_ms INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS waitlist (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT,
  tier TEXT,
  ip_address TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS processed_events (
  event_id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  processed_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  stripe_customer_id TEXT,
  stripe_session_id TEXT,
  plan_tier TEXT NOT NULL,
  status TEXT DEFAULT 'active', -- active, past_due, canceled
  amount_cents INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
