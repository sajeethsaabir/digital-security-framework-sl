CREATE TABLE IF NOT EXISTS sections (
  id SERIAL PRIMARY KEY,
  section_number TEXT,
  title TEXT,
  anchor_id TEXT,
  sort_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS subsections (
  id SERIAL PRIMARY KEY,
  section_id INT REFERENCES sections(id) ON DELETE CASCADE,
  subsection_number TEXT,
  title TEXT,
  anchor_id TEXT,
  sort_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS content_blocks (
  id SERIAL PRIMARY KEY,
  section_id INT REFERENCES sections(id) ON DELETE CASCADE,
  subsection_id INT REFERENCES subsections(id) ON DELETE CASCADE,
  content_type TEXT DEFAULT 'text',
  content TEXT,
  level INT DEFAULT 0,
  sort_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS emergency_contacts (
  id SERIAL PRIMARY KEY,
  category TEXT,
  name TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  description TEXT,
  sort_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS glossary_terms (
  id SERIAL PRIMARY KEY,
  term TEXT UNIQUE,
  definition TEXT
);

CREATE TABLE IF NOT EXISTS resources (
  id SERIAL PRIMARY KEY,
  category TEXT,
  name TEXT,
  url TEXT,
  description TEXT,
  sort_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sessions (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  token TEXT,
  expires_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS user_progress (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  content_block_id INT REFERENCES content_blocks(id) ON DELETE CASCADE,
  checked BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, content_block_id)
);

CREATE TABLE IF NOT EXISTS learning_paths (
  id SERIAL PRIMARY KEY,
  section_id INT REFERENCES sections(id) ON DELETE CASCADE,
  title TEXT,
  description TEXT,
  icon TEXT,
  difficulty TEXT,
  estimated_minutes INT,
  sort_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS learning_steps (
  id SERIAL PRIMARY KEY,
  path_id INT REFERENCES learning_paths(id) ON DELETE CASCADE,
  step_number INT,
  title TEXT,
  content TEXT,
  action_type TEXT,
  action_url TEXT,
  sort_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS quiz_questions (
  id SERIAL PRIMARY KEY,
  path_id INT REFERENCES learning_paths(id) ON DELETE CASCADE,
  question TEXT,
  options JSONB,
  correct_index INT,
  explanation TEXT,
  sort_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS user_learning_progress (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  path_id INT REFERENCES learning_paths(id) ON DELETE CASCADE,
  steps_completed JSONB DEFAULT '[]',
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  quiz_score INT,
  quiz_passed BOOLEAN,
  UNIQUE (user_id, path_id)
);

CREATE TABLE IF NOT EXISTS certificates (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  certificate_code TEXT,
  metadata JSONB,
  issued_at TIMESTAMPTZ DEFAULT NOW()
);