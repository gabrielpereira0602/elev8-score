-- Elev8 Score: cole tudo no Supabase em SQL Editor > New query > Run. Pode rodar mais de uma vez.

create extension if not exists pgcrypto;

create table if not exists public.diagnosticos (
  id uuid primary key default gen_random_uuid(),
  criado_em timestamptz not null default now(),
  place_id text not null,
  analise jsonb not null,
  contato jsonb not null,
  origem text not null default 'anuncio' check (origem in ('anuncio', 'prospeccao', 'parceiro')),
  parceiro text,
  convite text,
  form_kit jsonb not null default '{}'::jsonb,
  plano_feitas text[] not null default '{}',
  pago boolean not null default false,
  pago_em timestamptz,
  pagamento_id text,
  etapa text not null default 'novo',
  notas text,
  proposta jsonb,
  score_vivo boolean not null default false
);

create index if not exists diagnosticos_place_idx on public.diagnosticos (place_id, criado_em desc);
create index if not exists diagnosticos_criado_idx on public.diagnosticos (criado_em desc);

create table if not exists public.descadastros (
  email text primary key,
  criado_em timestamptz not null default now()
);

-- Segurança: RLS ligado e nenhuma política pública. Só o servidor (chave service_role) lê e grava.
alter table public.diagnosticos enable row level security;
alter table public.descadastros enable row level security;
