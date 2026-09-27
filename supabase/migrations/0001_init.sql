-- Wawa — schema inicial.
-- Diseño pensado para escalar el feed sin fan-out costoso en lectura:
-- una familia (grupo de padres + hijo) es la unidad de aislamiento, y las
-- políticas RLS filtran por family_id en vez de por author_id, para que
-- añadir más padres a una misma familia no requiera cambios de código.

create extension if not exists "pgcrypto";

create table if not exists families (
  id uuid primary key default gen_random_uuid(),
  child_name text,
  child_birthday date,
  created_at timestamptz not null default now()
);

create table if not exists profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  family_id uuid references families (id) on delete set null,
  display_name text not null,
  avatar_url text,
  created_at timestamptz not null default now()
);

create type capsule_kind as enum ('instant', 'moment', 'wisdom', 'secret');
create type unlock_type as enum ('immediate', 'date', 'age', 'milestone');

create table if not exists capsules (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families (id) on delete cascade,
  author_id uuid not null references profiles (id) on delete cascade,
  kind capsule_kind not null,
  title text not null,
  body text not null,
  media_url text,
  audio_url text,
  tags text[] not null default '{}',
  unlock_type unlock_type not null default 'immediate',
  unlock_at timestamptz,
  unlock_age integer,
  unlock_milestone text,
  created_at timestamptz not null default now()
);

-- The feed is read far more than it's written: index the exact predicate
-- the "Instant" / "Wisdom" / "Moments" pages filter and sort by.
create index if not exists capsules_family_kind_created_idx
  on capsules (family_id, kind, created_at desc);

create index if not exists capsules_tags_gin_idx on capsules using gin (tags);

alter table families enable row level security;
alter table profiles enable row level security;
alter table capsules enable row level security;

create policy "profiles: read own family" on profiles
  for select using (
    family_id in (select family_id from profiles where id = auth.uid())
  );

create policy "profiles: update own row" on profiles
  for update using (id = auth.uid());

create policy "capsules: read own family" on capsules
  for select using (
    family_id in (select family_id from profiles where id = auth.uid())
  );

create policy "capsules: insert into own family" on capsules
  for insert with check (
    author_id = auth.uid()
    and family_id in (select family_id from profiles where id = auth.uid())
  );

create policy "capsules: author can update own" on capsules
  for update using (author_id = auth.uid());

create policy "capsules: author can delete own" on capsules
  for delete using (author_id = auth.uid());
