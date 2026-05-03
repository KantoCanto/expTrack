create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  amount numeric(12, 2) not null check (amount > 0),
  category text,
  clerk_user_id text not null,
  spent_on date not null default current_date,
  created_at timestamptz not null default now()
);

alter table public.expenses
  add column if not exists clerk_user_id text;

update public.expenses
  set clerk_user_id = 'legacy'
  where clerk_user_id is null;

alter table public.expenses
  alter column clerk_user_id set not null;

create index if not exists expenses_clerk_user_id_idx
  on public.expenses (clerk_user_id);

alter table public.expenses enable row level security;

drop policy if exists "Allow anon expense reads" on public.expenses;
drop policy if exists "Allow anon expense inserts" on public.expenses;
drop policy if exists "Allow anon expense updates" on public.expenses;
drop policy if exists "Allow anon expense deletes" on public.expenses;

create policy "Allow anon expense reads"
  on public.expenses
  for select
  to anon
  using (true);

create policy "Allow anon expense inserts"
  on public.expenses
  for insert
  to anon
  with check (true);

create policy "Allow anon expense updates"
  on public.expenses
  for update
  to anon
  using (true)
  with check (true);

create policy "Allow anon expense deletes"
  on public.expenses
  for delete
  to anon
  using (true);
