# Ajman Coach — Football Player Management System

A complete professional system to manage football players, injuries, performance, and generate PDF reports.

## Features
- 👤 **Player management** — add / edit / delete / full profile
- 🩺 **Injury tracking** — record injuries, auto recovery date, recovery status
- 📊 **Performance** — match stats, pass accuracy, ratings, trend chart
- 📝 **Reports** — professional PDF (technical / tactical / physical / mental)
- 📅 **Training sessions** — schedule, link players, coach notes
- 🔐 **Auth** — Supabase email/password
- 🎨 **Modern UI** — responsive, dashboard layout

## Stack
Next.js 14 (App Router) · TypeScript · TailwindCSS · Supabase (Postgres + Auth + RLS) · @react-pdf/renderer · Recharts

## Setup

### 1. Clone & install
```bash
git clone <your-repo> ajman-coach
cd ajman-coach
npm install
```

### 2. Create Supabase project
Go to [supabase.com](https://supabase.com), create a project (free tier is fine).

### 3. Run schema
In the Supabase dashboard → **SQL Editor** → paste the contents of `supabase/schema.sql` → run.

### 4. Environment
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Fill the three values from **Supabase Dashboard → Project Settings → API**:
- `NEXT_PUBLIC_SUPABASE_URL` — Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — anon / public key
- `SUPABASE_SERVICE_ROLE_KEY` — service_role key (kept server-side only)

### 5. Auth setup
Supabase → **Authentication → Providers** → enable **Email**. For development, disable email confirmation (Auth → Settings → "Confirm email" off) so signup works without verification.

### 6. Run
```bash
npm run dev
```
Open http://localhost:3000 → sign up → you land on `/dashboard`.

## Deploy
- **Vercel**: import the repo, add the 3 env vars, deploy.
- **Supabase**: your DB is already cloud-hosted.

## Structure
```
src/
├── app/              Pages (App Router)
├── app/api/          API routes (server-side)
├── components/       UI components
├── lib/              Supabase clients, types, utils, PDF
└── middleware.ts     Auth redirection
supabase/schema.sql   Database schema + RLS policies
```

## Security
- All tables have **Row-Level Security** — coaches only see their own data
- Auth session stored in httpOnly cookies via `@supabase/ssr`
- Middleware guards `/dashboard/*` and `/api/*`

## How the data flows
1. Coach signs up → trigger creates `coaches` row
2. Coach adds players → `players.coach_id = auth.uid()`
3. Injuries / performances / sessions / evaluations all scoped to `coach_id`
4. RLS enforces isolation even if an API route had a bug

## Generating a report
Players list → click a player → **Report** button → edit evaluation → **Download PDF**.

The PDF includes:
- Player info + biometrics
- Match performance summary + last 10 matches
- Technical / Tactical / Physical / Mental evaluation
- Strengths, areas to improve, general notes
- Full injury history