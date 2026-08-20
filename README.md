# Digital Security Framework — Sri Lanka

A web application that turns the *Digital Security Toolkit v1.0* (Sri Lanka) into an
interactive digital safety guide. It helps everyday internet users in Sri Lanka respond
to cyberattacks, protect their data, prevent threats, report incidents, and build good
digital security habits.

The application consists of two projects:

| Directory    | Stack                                   | Port  |
| ------------ | --------------------------------------- | ----- |
| `dss-toolkit` | Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind CSS 4 | `3000` |
| `backend`    | NestJS 11, PostgreSQL (via `pg`)        | `3001` |

---

## Features

- **6 content sections** parsed from `dss-toolkit-v1.0.md` (attack response, data
  protection, prevention, best practices, reporting, emergency contacts)
- **Learning Center** — 6 interactive learning paths with steps, quizzes, per-user
  progress tracking, and a certificate earned by completing all paths
- **Search** across all content blocks (`/api/search`)
- **Glossary** of cybersecurity terms and a curated **Resources** directory
- **Emergency contacts** quick reference page with SLCERT hotline
- **Accounts** — signup/login/logout with cookie-based sessions and password hashing
- **Security hardening** — CSP and security headers, CSRF origin checks, input
  validation, and rate limiting

---

## Architecture

```
browser ──► Next.js (dss-toolkit, :3000) ──rewrite /api/*──► NestJS (backend, :3001) ──► PostgreSQL
```

- The Next.js app renders server-side and proxies all `/api/*` requests to the NestJS
  backend via `next.config.ts` rewrites.
- Both sides talk to the same PostgreSQL database (`dss_toolkit`).
- Content (sections, subsections, content blocks, contacts, glossary, resources) is
  seeded from the `dss-toolkit-v1.0.md` source document.
- The frontend also contains its own `src/lib/db.ts` used for server-rendered data
  fetching; runtime API calls go through the backend.

### Frontend routes

| Route               | Description                          |
| ------------------- | ------------------------------------ |
| `/`                 | Home with section cards              |
| `/sections/[id]`    | Section content with subsections     |
| `/emergency`        | Emergency contacts                   |
| `/glossary`         | Cybersecurity terms                  |
| `/resources`        | External resources                   |
| `/learn`            | Learning Center overview             |
| `/learn/[id]`       | Learning path steps                  |
| `/learn/quiz/[id]`  | Quiz for a path                      |
| `/learn/certificate`| Completion certificate               |

### Backend API (`/api`)

| Route                | Description                             |
| -------------------- | --------------------------------------- |
| `auth/login`, `auth/signup`, `auth/logout`, `auth/me` | Session auth |
| `search?q=...`       | Full-text content search                |
| `progress`           | Checklist progress (GET/POST)           |
| `learn/path-data`    | Learning paths and steps                |
| `learn/quiz-data`    | Quiz questions                          |
| `learn/quiz`         | Submit quiz answers (grading)           |
| `learn/progress`     | Learning progress (GET/POST)            |
| `learn/certificate`  | Certificate lookup / creation           |

---

## Prerequisites

- **Node.js** (18+)
- **PostgreSQL** (the app connects over a Unix socket by default — see below)

The default database connection is a PostgreSQL instance listening on the Unix socket
directory `/tmp/opencode`, port `5433`, database `dss_toolkit`, user `zuko`. To use a
different setup, override via environment variables.

---

## Setup

### 1. Install dependencies

```bash
cd dss-toolkit && npm install
cd ../backend && npm install
```

### 2. Start PostgreSQL and create the database

The repository has no committed schema file — the tables are created by running the
seed scripts. With a local Postgres cluster on socket `/tmp/opencode` (port `5433`)
owned by user `zuko`:

```bash
# start a dedicated cluster (as the app expects)
/usr/lib/postgresql/16/bin/initdb -D /tmp/opencode/pgdata -U zuko --auth=trust -E UTF8
/usr/lib/postgresql/16/bin/pg_ctl -D /tmp/opencode/pgdata -l /tmp/opencode/pg.log \
  -o "-p 5433 -k /tmp/opencode" start
createdb -h /tmp/opencode -p 5433 -U zuko dss_toolkit
```

Alternatively, point the app at an existing Postgres using environment variables
(see [Configuration](#configuration)).

### 3. Create the schema and seed the database

```bash
# 1. Create tables (schema below)
psql -h /tmp/opencode -p 5433 -U zuko -d dss_toolkit -f /tmp/opencode/schema.sql

# 2. Seed content from the toolkit document (sections, blocks, contacts, glossary, resources)
cd dss-toolkit
node scripts/seed.cjs ../dss-toolkit-v1.0.md

# 3. Seed learning paths, steps, and quiz questions
node scripts/seed-learning.cjs
```

> **Note:** `seed-learning.cjs` must run after `seed.cjs` because it links each learning
> path to a section by `section_number`.

#### Database schema

14 tables created by `schema.sql` (not committed to the repo):

- **Content:** `sections`, `subsections`, `content_blocks`
- **Reference:** `emergency_contacts`, `glossary_terms`, `resources`
- **Auth:** `users`, `sessions`
- **Progress:** `user_progress` (checklists), `user_learning_progress` (learning paths)
- **Learning:** `learning_paths`, `learning_steps`, `quiz_questions`, `certificates`

### 4. Run the application

```bash
# Frontend on :3000, backend on :3001
cd dss-toolkit
npm run dev:all
```

Or run them separately:

```bash
# terminal 1
cd backend && npm run dev       # NestJS on :3001

# terminal 2
cd dss-toolkit && npm run dev   # Next.js on :3000
```

Open [http://localhost:3000](http://localhost:3000).

---

## Configuration

Environment variables (backend):

| Variable        | Default              | Description                    |
| --------------- | -------------------- | ------------------------------ |
| `PORT`          | `3001`               | Backend port                   |
| `DB_HOST`       | `/tmp/opencode`      | Postgres host (Unix socket)    |
| `DB_PORT`       | `5433`               | Postgres port                  |
| `DB_NAME`       | `dss_toolkit`        | Database name                  |
| `DB_USER`       | `zuko`               | Database user                  |
| `CORS_ORIGIN`   | `http://localhost:3000` | Allowed CORS origin         |

---

## Scripts

From `dss-toolkit/package.json`:

| Script            | Description                                 |
| ----------------- | ------------------------------------------- |
| `npm run dev`     | Start Next.js dev server                    |
| `npm run dev:backend` | Start the NestJS backend                 |
| `npm run dev:all` | Start frontend + backend concurrently       |
| `npm run build`   | Build the Next.js app                       |
| `npm run build:all` | Build backend then frontend              |
| `npm run start`   | Start the production Next.js server         |
| `npm run lint`    | Run ESLint                                  |

From `backend/package.json`:

| Script        | Description              |
| ------------- | ------------------------ |
| `npm run build` | Compile NestJS to `dist` |
| `npm run start`  | Run the compiled server  |
| `npm run dev`    | Start with watch mode    |

---

## Project structure

```
.
├── dss-toolkit/                 # Next.js frontend
│   ├── scripts/
│   │   ├── seed.cjs             # Seeds content from dss-toolkit-v1.0.md
│   │   └── seed-learning.cjs    # Seeds learning paths + quizzes
│   └── src/
│       ├── app/                 # App Router pages (sections, learn, glossary, ...)
│       ├── components/          # Layout, Sidebar, SearchBar, ContentRenderer, ...
│       ├── lib/                 # db.ts, auth.ts, security.ts, seed.ts
│       └── proxy.ts             # Middleware: security headers + CSRF checks
│
├── backend/                     # NestJS API
│   └── src/
│       ├── db/                  # pg Pool + data access (DbService)
│       ├── auth/                # signup/login/logout/session
│       ├── progress/            # checklist progress
│       ├── search/              # content search
│       └── learn/               # paths, quizzes, progress, certificates
│
├── dss-toolkit-v1.0.md          # Source document (content is seeded from here)
├── .gitignore
└── README.md
```

---

## Security notes

- Auth sessions use `httpOnly`, `secure`, `SameSite=Strict` cookies; passwords are
  hashed with salted, iterated SHA-256.
- The frontend middleware (`src/proxy.ts`) adds CSP, HSTS, and other security headers
  and enforces CSRF origin checks on JSON `POST` requests.
- Seed scripts and backend validate/sanitize user input (email format, password
  strength, name escaping, SQL injection guards, rate limiting).