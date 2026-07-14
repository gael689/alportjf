-- Secciones destacadas de la home: reemplaza el esquema rígido de "destacado | nuevo"
-- por vitrinas configurables desde el panel (crear, renombrar, reordenar, y asignar
-- cualquier producto a cualquier sección). Los flags productos.destacado / productos.nuevo
-- se mantienen (se siguen usando como badge/filtro del catálogo), pero la ubicación en la
-- home ahora la decide esta tabla.

create table if not exists secciones (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  nombre text not null,
  subtitulo text,
  activo boolean not null default true,
  orden integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists producto_secciones (
  producto_id uuid not null references productos(id) on delete cascade,
  seccion_id uuid not null references secciones(id) on delete cascade,
  orden integer not null default 0,
  primary key (producto_id, seccion_id)
);

create index if not exists producto_secciones_seccion_id_idx on producto_secciones (seccion_id, orden);
create index if not exists producto_secciones_producto_id_idx on producto_secciones (producto_id);

drop trigger if exists set_updated_at on secciones;
create trigger set_updated_at before update on secciones
  for each row execute function set_updated_at();

-- Row Level Security: mismo criterio que el resto (público ve activo, admin ve y edita todo).
alter table secciones enable row level security;
alter table producto_secciones enable row level security;

drop policy if exists "secciones_public_select" on secciones;
create policy "secciones_public_select" on secciones
  for select to anon using (activo = true);

drop policy if exists "secciones_admin_select" on secciones;
create policy "secciones_admin_select" on secciones
  for select to authenticated using (true);
drop policy if exists "secciones_admin_write" on secciones;
create policy "secciones_admin_write" on secciones
  for all to authenticated using (true) with check (true);

drop policy if exists "producto_secciones_public_select" on producto_secciones;
create policy "producto_secciones_public_select" on producto_secciones
  for select to anon using (true);

drop policy if exists "producto_secciones_admin_select" on producto_secciones;
create policy "producto_secciones_admin_select" on producto_secciones
  for select to authenticated using (true);
drop policy if exists "producto_secciones_admin_write" on producto_secciones;
create policy "producto_secciones_admin_write" on producto_secciones
  for all to authenticated using (true) with check (true);

-- Semilla: 2 secciones iniciales, migrando los productos que ya tenían destacado/nuevo
-- en true, para que la home se vea exactamente igual apenas se corre esta migración.
insert into secciones (slug, nombre, subtitulo, orden, activo)
values
  ('destacados', 'Productos destacados', 'Lo que más se vende en Alport JF', 0, true),
  ('lo-mas-nuevo', 'Lo más nuevo', 'Recién llegado a la tienda', 1, true)
on conflict (slug) do nothing;

insert into producto_secciones (producto_id, seccion_id, orden)
select p.id, s.id, row_number() over (order by p.created_at desc)
from productos p, secciones s
where p.destacado = true and s.slug = 'destacados'
on conflict (producto_id, seccion_id) do nothing;

insert into producto_secciones (producto_id, seccion_id, orden)
select p.id, s.id, row_number() over (order by p.created_at desc)
from productos p, secciones s
where p.nuevo = true and s.slug = 'lo-mas-nuevo'
on conflict (producto_id, seccion_id) do nothing;
