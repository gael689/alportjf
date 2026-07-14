-- Row Level Security: el sitio público (rol "anon") solo ve filas activas.
-- Cualquier usuario logueado en Supabase Auth (rol "authenticated") es administrador
-- del panel: no hace falta una tabla de roles para 1-3 usuarios de un comercio.
-- Los usuarios admin se crean a mano desde Authentication > Users en el dashboard de Supabase.

alter table categorias enable row level security;
alter table productos enable row level security;
alter table producto_imagenes enable row level security;
alter table banners enable row level security;

-- Lectura pública de filas activas
drop policy if exists "categorias_public_select" on categorias;
create policy "categorias_public_select" on categorias
  for select to anon using (activo = true);

drop policy if exists "productos_public_select" on productos;
create policy "productos_public_select" on productos
  for select to anon using (activo = true);

drop policy if exists "producto_imagenes_public_select" on producto_imagenes;
create policy "producto_imagenes_public_select" on producto_imagenes
  for select to anon using (true);

drop policy if exists "banners_public_select" on banners;
create policy "banners_public_select" on banners
  for select to anon using (activo = true);

-- El panel (usuarios autenticados) lee y escribe todo, incluidas filas inactivas
drop policy if exists "categorias_admin_select" on categorias;
create policy "categorias_admin_select" on categorias
  for select to authenticated using (true);
drop policy if exists "categorias_admin_write" on categorias;
create policy "categorias_admin_write" on categorias
  for all to authenticated using (true) with check (true);

drop policy if exists "productos_admin_select" on productos;
create policy "productos_admin_select" on productos
  for select to authenticated using (true);
drop policy if exists "productos_admin_write" on productos;
create policy "productos_admin_write" on productos
  for all to authenticated using (true) with check (true);

drop policy if exists "producto_imagenes_admin_select" on producto_imagenes;
create policy "producto_imagenes_admin_select" on producto_imagenes
  for select to authenticated using (true);
drop policy if exists "producto_imagenes_admin_write" on producto_imagenes;
create policy "producto_imagenes_admin_write" on producto_imagenes
  for all to authenticated using (true) with check (true);

drop policy if exists "banners_admin_select" on banners;
create policy "banners_admin_select" on banners
  for select to authenticated using (true);
drop policy if exists "banners_admin_write" on banners;
create policy "banners_admin_write" on banners
  for all to authenticated using (true) with check (true);
