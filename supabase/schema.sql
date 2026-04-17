-- =======================================================
-- AJMAN COACH — Database Schema
-- Run this in Supabase SQL Editor
-- =======================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- =======================================================
-- COACHES (extends Supabase auth.users)
-- =======================================================
create table if not exists public.coaches (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null unique,
  club_name text default 'Ajman Club',
  created_at timestamptz default now()
);

-- =======================================================
-- PLAYERS
-- =======================================================
create table if not exists public.players (
  id uuid primary key default uuid_generate_v4(),
  coach_id uuid not null references public.coaches(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  date_of_birth date not null,
  position text not null check (position in ('GK','DEF','MID','FWD')),
  team text not null,
  jersey_number int,
  height_cm numeric,
  weight_kg numeric,
  nationality text,
  photo_url text,
  status text not null default 'fit' check (status in ('fit','injured','recovering')),
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_players_coach on public.players(coach_id);
create index if not exists idx_players_team on public.players(team);

-- =======================================================
-- INJURIES
-- =======================================================
create table if not exists public.injuries (
  id uuid primary key default uuid_generate_v4(),
  player_id uuid not null references public.players(id) on delete cascade,
  coach_id uuid not null references public.coaches(id) on delete cascade,
  injury_type text not null,
  body_part text not null,
  severity text not null check (severity in ('minor','moderate','severe')),
  injury_date date not null,
  expected_recovery_days int not null,
  expected_return_date date not null,
  actual_return_date date,
  status text not null default 'active' check (status in ('active','recovered')),
  notes text,
  created_at timestamptz default now()
);

create index if not exists idx_injuries_player on public.injuries(player_id);
create index if not exists idx_injuries_status on public.injuries(status);

-- =======================================================
-- PERFORMANCES (match stats)
-- =======================================================
create table if not exists public.performances (
  id uuid primary key default uuid_generate_v4(),
  player_id uuid not null references public.players(id) on delete cascade,
  coach_id uuid not null references public.coaches(id) on delete cascade,
  match_date date not null,
  opponent text not null,
  minutes_played int default 0,
  goals int default 0,
  assists int default 0,
  passes_completed int default 0,
  passes_attempted int default 0,
  tackles int default 0,
  shots int default 0,
  shots_on_target int default 0,
  rating numeric check (rating >= 0 and rating <= 10),
  notes text,
  created_at timestamptz default now()
);

create index if not exists idx_performances_player on public.performances(player_id);
create index if not exists idx_performances_date on public.performances(match_date desc);

-- =======================================================
-- TRAINING SESSIONS
-- =======================================================
create table if not exists public.sessions (
  id uuid primary key default uuid_generate_v4(),
  coach_id uuid not null references public.coaches(id) on delete cascade,
  title text not null,
  session_date date not null,
  duration_minutes int not null default 90,
  focus_area text not null,
  location text,
  coach_notes text,
  created_at timestamptz default now()
);

create index if not exists idx_sessions_coach on public.sessions(coach_id);
create index if not exists idx_sessions_date on public.sessions(session_date desc);

-- =======================================================
-- SESSION PLAYERS (junction)
-- =======================================================
create table if not exists public.session_players (
  session_id uuid not null references public.sessions(id) on delete cascade,
  player_id uuid not null references public.players(id) on delete cascade,
  attended boolean default true,
  individual_notes text,
  primary key (session_id, player_id)
);

-- =======================================================
-- EVALUATIONS (technical, tactical, physical, mental)
-- =======================================================
create table if not exists public.evaluations (
  id uuid primary key default uuid_generate_v4(),
  player_id uuid not null references public.players(id) on delete cascade,
  coach_id uuid not null references public.coaches(id) on delete cascade,
  evaluation_date date not null default current_date,
  -- Technical (1-10)
  tech_first_touch int check (tech_first_touch between 1 and 10),
  tech_passing int check (tech_passing between 1 and 10),
  tech_shooting int check (tech_shooting between 1 and 10),
  tech_dribbling int check (tech_dribbling between 1 and 10),
  -- Tactical (1-10)
  tac_positioning int check (tac_positioning between 1 and 10),
  tac_decision_making int check (tac_decision_making between 1 and 10),
  tac_game_reading int check (tac_game_reading between 1 and 10),
  -- Physical (1-10)
  phy_speed int check (phy_speed between 1 and 10),
  phy_strength int check (phy_strength between 1 and 10),
  phy_endurance int check (phy_endurance between 1 and 10),
  -- Mental (1-10)
  men_concentration int check (men_concentration between 1 and 10),
  men_confidence int check (men_confidence between 1 and 10),
  men_teamwork int check (men_teamwork between 1 and 10),
  -- Notes
  strengths text,
  areas_to_improve text,
  general_notes text,
  created_at timestamptz default now()
);

create index if not exists idx_evaluations_player on public.evaluations(player_id);

-- =======================================================
-- ROW LEVEL SECURITY
-- =======================================================
alter table public.coaches enable row level security;
alter table public.players enable row level security;
alter table public.injuries enable row level security;
alter table public.performances enable row level security;
alter table public.sessions enable row level security;
alter table public.session_players enable row level security;
alter table public.evaluations enable row level security;

-- Coaches can only see and edit their own data
create policy "Coaches view own" on public.coaches for select using (auth.uid() = id);
create policy "Coaches update own" on public.coaches for update using (auth.uid() = id);
create policy "Coaches insert own" on public.coaches for insert with check (auth.uid() = id);

create policy "Players coach access" on public.players for all using (coach_id = auth.uid());
create policy "Injuries coach access" on public.injuries for all using (coach_id = auth.uid());
create policy "Performances coach access" on public.performances for all using (coach_id = auth.uid());
create policy "Sessions coach access" on public.sessions for all using (coach_id = auth.uid());
create policy "Evaluations coach access" on public.evaluations for all using (coach_id = auth.uid());

create policy "Session players coach access" on public.session_players for all
  using (exists (select 1 from public.sessions s where s.id = session_id and s.coach_id = auth.uid()));

-- =======================================================
-- AUTO-UPDATE updated_at on players
-- =======================================================
create or replace function public.touch_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

drop trigger if exists trg_players_updated on public.players;
create trigger trg_players_updated before update on public.players
  for each row execute function public.touch_updated_at();

-- =======================================================
-- AUTO-CREATE coach row on signup
-- =======================================================
create or replace function public.handle_new_user() returns trigger as $$
begin
  insert into public.coaches (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', new.email));
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();