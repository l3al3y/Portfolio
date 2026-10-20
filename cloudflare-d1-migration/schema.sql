-- Cloudflare D1 Database Schema for irfanfahmi.com Portfolio

-- 1. Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  sort_order INTEGER NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  summary TEXT NOT NULL,
  image_url TEXT,
  stack_json TEXT NOT NULL, -- JSON array: ["YOLOv8", "Python", ...]
  problem TEXT NOT NULL,
  implementation TEXT NOT NULL,
  constraints TEXT NOT NULL,
  outcome TEXT NOT NULL,
  result TEXT NOT NULL,
  result_note TEXT,
  links_json TEXT NOT NULL,   -- JSON array: [{"label": "Explore", "url": "..."}]
  sources_json TEXT NOT NULL, -- JSON array: [{"label": "Source", "url": "..."}]
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Credentials & Certificates Table
CREATE TABLE IF NOT EXISTS credentials (
  id TEXT PRIMARY KEY,
  sort_order INTEGER NOT NULL,
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  date_label TEXT NOT NULL,
  category TEXT NOT NULL,
  category_label TEXT NOT NULL,
  pdf_filename TEXT NOT NULL,
  thumbnail_url TEXT,
  verification_status TEXT DEFAULT 'verified', -- 'verified', 'pending', 'course_completion'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. Document Manifest Table
CREATE TABLE IF NOT EXISTS documents (
  document_path TEXT PRIMARY KEY,
  page_count INTEGER NOT NULL,
  width INTEGER,
  height INTEGER,
  preview_format TEXT DEFAULT 'webp',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. Releases Table (SMC Crows & Nightfall metadata)
CREATE TABLE IF NOT EXISTS releases (
  tag TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  version_code INTEGER,
  target_sdk INTEGER,
  exact_bytes INTEGER,
  sha256_hash TEXT NOT NULL,
  download_url TEXT NOT NULL,
  mirror_url TEXT,
  is_active BOOLEAN DEFAULT 1,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indices for instant edge performance
CREATE INDEX IF NOT EXISTS idx_projects_order ON projects(sort_order);
CREATE INDEX IF NOT EXISTS idx_credentials_category ON credentials(category);
CREATE INDEX IF NOT EXISTS idx_credentials_order ON credentials(sort_order);
