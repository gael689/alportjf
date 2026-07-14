-- Buckets de Storage para las fotos que se suben desde el panel (archivo o cámara).
-- Lectura pública (para poder mostrarlas en el sitio), escritura solo para admins logueados.

insert into storage.buckets (id, name, public)
values ('productos', 'productos', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('banners', 'banners', true)
on conflict (id) do nothing;

drop policy if exists "productos_bucket_public_read" on storage.objects;
create policy "productos_bucket_public_read" on storage.objects
  for select to anon, authenticated using (bucket_id = 'productos');

drop policy if exists "productos_bucket_admin_write" on storage.objects;
create policy "productos_bucket_admin_write" on storage.objects
  for insert to authenticated with check (bucket_id = 'productos');

drop policy if exists "productos_bucket_admin_update" on storage.objects;
create policy "productos_bucket_admin_update" on storage.objects
  for update to authenticated using (bucket_id = 'productos');

drop policy if exists "productos_bucket_admin_delete" on storage.objects;
create policy "productos_bucket_admin_delete" on storage.objects
  for delete to authenticated using (bucket_id = 'productos');

drop policy if exists "banners_bucket_public_read" on storage.objects;
create policy "banners_bucket_public_read" on storage.objects
  for select to anon, authenticated using (bucket_id = 'banners');

drop policy if exists "banners_bucket_admin_write" on storage.objects;
create policy "banners_bucket_admin_write" on storage.objects
  for insert to authenticated with check (bucket_id = 'banners');

drop policy if exists "banners_bucket_admin_update" on storage.objects;
create policy "banners_bucket_admin_update" on storage.objects
  for update to authenticated using (bucket_id = 'banners');

drop policy if exists "banners_bucket_admin_delete" on storage.objects;
create policy "banners_bucket_admin_delete" on storage.objects
  for delete to authenticated using (bucket_id = 'banners');
