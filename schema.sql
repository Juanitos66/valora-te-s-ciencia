-- VALÓRATE CON S-CIENCIA 4.0 — esquema de seguridad y agregación.
-- Ejecutar en Supabase SQL Editor. Probar primero con registros ficticios.
-- No publicar nunca una clave service_role en el frontend.

create schema if not exists extensions;
create extension if not exists pgcrypto with schema extensions;

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

-- Se impide registrar más de un pretest y un postest por código seudónimo.
-- Si ya existen duplicados históricos, deben revisarse antes de crear este índice.
create unique index if not exists assessments_participant_phase_uidx
  on public.assessments(participant_hash, phase);

alter table public.assessments enable row level security;
revoke all on public.assessments from anon, authenticated;

drop policy if exists "No direct public select" on public.assessments;
drop policy if exists "Authenticated direct select disabled" on public.assessments;
create policy "No direct public select"
  on public.assessments for select to anon using (false);
create policy "Authenticated direct select disabled"
  on public.assessments for select to authenticated using (false);

-- Se guarda una clave privada del lado de la base para generar HMAC.
-- Así no se usa un SHA-256 simple susceptible a ataques de diccionario
-- cuando el código anónimo tiene poca entropía.
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
create table if not exists private.sciencia_hash_secret (
  id boolean primary key default true check (id),
  secret text not null
);
revoke all on private.sciencia_hash_secret from public, anon, authenticated;
insert into private.sciencia_hash_secret(id, secret)
values (true, encode(extensions.gen_random_bytes(32), 'hex'))
on conflict (id) do nothing;

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
set search_path = public, private, pg_temp
as $$
declare
  v_hash text;
  v_secret text;
begin
  if p_code is null or p_code !~ '^[A-Za-z0-9]{2,12}$' then
    raise exception 'Código anónimo no válido';
  end if;
  if p_phase not in ('pre','post') then
    raise exception 'Fase no válida';
  end if;
  if p_score is null or p_score < 0 or p_score > 100 then
    raise exception 'Puntaje fuera de rango';
  end if;
  if p_dimensions is null or jsonb_typeof(p_dimensions) <> 'object' then
    raise exception 'Dimensiones requeridas';
  end if;
  if p_group is not null and p_group !~ '^[A-Za-z0-9_-]{1,20}$' then
    raise exception 'Código de grupo no válido';
  end if;

  select secret into strict v_secret
  from private.sciencia_hash_secret
  where id = true;

  v_hash := encode(extensions.hmac(lower(trim(p_code)), v_secret, 'sha256'), 'hex');

  insert into public.assessments(participant_hash, phase, group_code, score, dimensions)
  values (v_hash, p_phase, nullif(upper(trim(p_group)),''), p_score, p_dimensions);
exception
  when unique_violation then
    raise exception 'Ya existe un registro para este código y esta fase.';
end;
$$;

revoke all on function public.submit_assessment(text,text,text,integer,jsonb) from public;
grant execute on function public.submit_assessment(text,text,text,integer,jsonb) to anon, authenticated;

-- Se revoca la vista anterior porque exponía filas individuales y no agregados.
do $revoke$
begin
  if to_regclass('public.assessment_summary') is not null then
    execute 'revoke all on public.assessment_summary from anon, authenticated';
  end if;
end
$revoke$;

-- El panel docente recibe únicamente indicadores agregados de pares completos, nunca códigos,
-- hashes, fechas individuales ni respuestas de cada estudiante.
create or replace function public.get_assessment_summary()
returns table (
  participant_count bigint,
  pre_average numeric,
  post_average numeric,
  relative_change numeric
)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if auth.uid() is null then
    raise exception 'Se requiere una sesión docente autenticada.';
  end if;

  return query
  with paired as (
    select
      participant_hash,
      max(score) filter (where phase = 'pre') as pre_score,
      max(score) filter (where phase = 'post') as post_score
    from public.assessments
    group by participant_hash
    having count(*) filter (where phase = 'pre') > 0
       and count(*) filter (where phase = 'post') > 0
  ),
  stats as (
    select
      count(*)::bigint as participants,
      avg(pre_score) as pre_avg,
      avg(post_score) as post_avg
    from paired
  )
  select
    participants,
    pre_avg::numeric(8,2),
    post_avg::numeric(8,2),
    case
      when pre_avg > 0 and post_avg is not null
      then ((post_avg - pre_avg) / pre_avg * 100)::numeric(8,2)
      else null
    end
  from stats;
end;
$$;

revoke all on function public.get_assessment_summary() from public, anon;
grant execute on function public.get_assessment_summary() to authenticated;

-- IMPORTANTE PARA LA APLICACIÓN:
-- 1. Los códigos deben ser aleatorios, entregados por el responsable del estudio.
-- 2. Un hash/HMAC seudonimiza; no convierte por sí solo los datos en anónimos.
-- 3. La tabla no permite lectura directa desde el navegador.
-- 4. El panel docente usa exclusivamente get_assessment_summary().
-- 5. Validar consentimiento/asentimiento, protección de datos y protocolo de apoyo
--    antes de cualquier levantamiento real con estudiantes.
