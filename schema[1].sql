-- VALÓRATE CON S-CIENCIA 4.0
-- Esquema recomendado para Supabase/PostgreSQL.
-- IMPORTANTE: probar primero con datos ficticios y autorización institucional.

create extension if not exists pgcrypto;

create table if not exists public.assessments (
  id uuid primary key default gen_random_uuid(),
  participant_hash text not null,
  phase text not null check (phase in ('pre','post')),
  group_code text,
  score integer not null check (score between 0 and 100),
  dimensions jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists assessments_phase_idx on public.assessments(phase);
create index if not exists assessments_created_idx on public.assessments(created_at);
create index if not exists assessments_group_idx on public.assessments(group_code);

alter table public.assessments enable row level security;

-- No se concede SELECT directo al público.
revoke all on public.assessments from anon;
revoke all on public.assessments from authenticated;

-- La función recibe un código anónimo y guarda solamente un hash irreversible.
create or replace function public.submit_assessment(
  p_code text,
  p_phase text,
  p_group text,
  p_score integer,
  p_dimensions jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_hash text;
begin
  if p_code is null or p_code !~ '^[A-Za-z0-9]{2,12}$' then
    raise exception 'Código anónimo no válido';
  end if;

  if p_phase not in ('pre','post') then
    raise exception 'Fase no válida';
  end if;

  if p_score < 0 or p_score > 100 then
    raise exception 'Puntaje fuera de rango';
  end if;

  if p_dimensions is null then
    raise exception 'Dimensiones requeridas';
  end if;

  -- El hash evita guardar el código original en la tabla.
  v_hash := encode(digest(lower(trim(p_code)), 'sha256'), 'hex');

  insert into public.assessments(participant_hash, phase, group_code, score, dimensions)
  values (v_hash, p_phase, nullif(left(trim(p_group),20),''), p_score, p_dimensions);
end;
$$;

revoke all on function public.submit_assessment(text,text,text,integer,jsonb) from public;
grant execute on function public.submit_assessment(text,text,text,integer,jsonb) to anon;
grant execute on function public.submit_assessment(text,text,text,integer,jsonb) to authenticated;

-- Vista agregada para el panel docente.
-- No expone códigos, hashes ni respuestas individuales.
create or replace view public.assessment_summary as
select
  id,
  phase,
  score,
  group_code,
  created_at
from public.assessments;

-- Para seguridad, el panel usa la vista sólo con usuario autenticado.
revoke all on public.assessment_summary from anon;
grant select on public.assessment_summary to authenticated;

-- RLS adicional sobre la tabla: nadie puede consultar directamente.
create policy "No direct public select"
on public.assessments for select
to anon
using (false);

create policy "Authenticated direct select disabled"
on public.assessments for select
to authenticated
using (false);

-- NOTA:
-- Para una institución real, se recomienda una Edge Function o política
-- adicional que permita al docente consultar únicamente agregados y,
-- de ser necesario, filtrar por grupo/periodo.
