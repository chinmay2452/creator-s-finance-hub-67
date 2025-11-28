create table if not exists profiles (
  id uuid primary key,
  display_name text,
  goals jsonb,
  created_at timestamp with time zone default now()
);

create table if not exists accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  platform text,
  account_id text,
  display_name text,
  created_at timestamp with time zone default now()
);

create table if not exists transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  type text check (type in ('income','expense')),
  category text,
  amount numeric,
  currency text default 'USD',
  date date,
  meta jsonb,
  created_at timestamp with time zone default now()
);

create table if not exists income_streams (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  platform text,
  amount numeric,
  currency text default 'USD',
  date date,
  status text default 'paid',
  source_ref text,
  created_at timestamp with time zone default now()
);

create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  message text,
  created_at timestamp with time zone default now(),
  read boolean default false
);

