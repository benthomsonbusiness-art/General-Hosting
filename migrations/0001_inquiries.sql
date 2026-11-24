CREATE TABLE IF NOT EXISTS inquiries (
  id TEXT PRIMARY KEY,               -- crypto.randomUUID()
  created_at TEXT NOT NULL,          -- ISO 8601 UTC
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  company_role TEXT NOT NULL,
  practice TEXT NOT NULL,
  note TEXT NOT NULL,
  ip_hash TEXT,                      -- SHA-256(ip + day + IP_HASH_SALT); never the raw IP
  delivery_status TEXT NOT NULL,     -- 'pending' | 'delivered' | 'failed' | 'no_channel'
  delivery_detail TEXT
);
CREATE INDEX IF NOT EXISTS idx_inquiries_ip_time ON inquiries(ip_hash, created_at);
