-- PY-013: learner profile and progress tables

create table if not exists profiles (
  id         uuid primary key default gen_random_uuid(),
  username   text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists path_completions (
  id           uuid primary key default gen_random_uuid(),
  profile_id   uuid not null references profiles(id) on delete cascade,
  skill_id     text not null,
  level        text not null check (level in ('easy', 'mid', 'hard')),
  xp_awarded   int  not null check (xp_awarded > 0),
  completed_at timestamptz not null default now(),
  unique (profile_id, skill_id, level)
);

-- Index for fast per-profile lookups
create index if not exists path_completions_profile_idx
  on path_completions (profile_id);
