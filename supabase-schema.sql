create table if not exists public.portfolio_admins (
  email text primary key
);

create table if not exists public.portfolio_artes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null default 'geral',
  image_url text not null,
  project_url text,
  notes text,
  published boolean not null default true,
  sort_order integer not null default 0,
  created_by uuid default auth.uid(),
  created_at timestamptz not null default now()
);

alter table public.portfolio_admins enable row level security;
alter table public.portfolio_artes enable row level security;

drop policy if exists "admins can read own allowlist" on public.portfolio_admins;
create policy "admins can read own allowlist"
on public.portfolio_admins for select
using (email = auth.jwt() ->> 'email');

drop policy if exists "public can read published portfolio" on public.portfolio_artes;
create policy "public can read published portfolio"
on public.portfolio_artes for select
using (published = true);

drop policy if exists "admins can read all portfolio" on public.portfolio_artes;
create policy "admins can read all portfolio"
on public.portfolio_artes for select
using (exists (
  select 1 from public.portfolio_admins
  where email = auth.jwt() ->> 'email'
));

drop policy if exists "admins can insert portfolio" on public.portfolio_artes;
create policy "admins can insert portfolio"
on public.portfolio_artes for insert
with check (exists (
  select 1 from public.portfolio_admins
  where email = auth.jwt() ->> 'email'
));

drop policy if exists "admins can update portfolio" on public.portfolio_artes;
create policy "admins can update portfolio"
on public.portfolio_artes for update
using (exists (
  select 1 from public.portfolio_admins
  where email = auth.jwt() ->> 'email'
))
with check (exists (
  select 1 from public.portfolio_admins
  where email = auth.jwt() ->> 'email'
));

drop policy if exists "admins can delete portfolio" on public.portfolio_artes;
create policy "admins can delete portfolio"
on public.portfolio_artes for delete
using (exists (
  select 1 from public.portfolio_admins
  where email = auth.jwt() ->> 'email'
));

insert into storage.buckets (id, name, public)
values ('portfolio-artes', 'portfolio-artes', true)
on conflict (id) do update set public = true;

drop policy if exists "public can read portfolio files" on storage.objects;
create policy "public can read portfolio files"
on storage.objects for select
using (bucket_id = 'portfolio-artes');

drop policy if exists "admins can upload portfolio files" on storage.objects;
create policy "admins can upload portfolio files"
on storage.objects for insert
with check (
  bucket_id = 'portfolio-artes'
  and exists (
    select 1 from public.portfolio_admins
    where email = auth.jwt() ->> 'email'
  )
);

drop policy if exists "admins can update portfolio files" on storage.objects;
create policy "admins can update portfolio files"
on storage.objects for update
using (
  bucket_id = 'portfolio-artes'
  and exists (
    select 1 from public.portfolio_admins
    where email = auth.jwt() ->> 'email'
  )
)
with check (
  bucket_id = 'portfolio-artes'
  and exists (
    select 1 from public.portfolio_admins
    where email = auth.jwt() ->> 'email'
  )
);

drop policy if exists "admins can delete portfolio files" on storage.objects;
create policy "admins can delete portfolio files"
on storage.objects for delete
using (
  bucket_id = 'portfolio-artes'
  and exists (
    select 1 from public.portfolio_admins
    where email = auth.jwt() ->> 'email'
  )
);

-- Troque pelo email que voce vai usar para entrar no /admin.html
insert into public.portfolio_admins (email)
values ('SEU_EMAIL_AQUI')
on conflict (email) do nothing;
