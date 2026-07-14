-- Alport JF — esquema de datos para el panel autoadministrable.
-- Ejecutar en el SQL Editor de Supabase, en orden (0001, 0002, 0003, 0004).

create extension if not exists pgcrypto;

create table if not exists categorias (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  nombre text not null,
  -- nombre de ícono de Heroicons (24/outline), resuelto en lib/category-icons.tsx
  icono text not null default 'HomeIcon',
  destacada boolean not null default false,
  activo boolean not null default true,
  orden integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists productos (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  nombre text not null,
  marca text,
  descripcion text not null,
  descripcion_larga text,
  categoria_id uuid not null references categorias(id) on delete restrict,
  -- precio en ARS. NULL = "sin precio" (se muestra "Consultar precio" y solo botón de WhatsApp)
  precio numeric(12, 2),
  precio_promo numeric(12, 2),
  oferta_hasta timestamptz,
  destacado boolean not null default false,
  nuevo boolean not null default false,
  stock integer,
  activo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint precio_promo_menor_a_precio check (
    precio_promo is null or precio is null or precio_promo < precio
  )
);

create index if not exists productos_categoria_id_idx on productos (categoria_id);
create index if not exists productos_activo_destacado_idx on productos (activo, destacado);
create index if not exists productos_activo_nuevo_idx on productos (activo, nuevo);

create table if not exists producto_imagenes (
  id uuid primary key default gen_random_uuid(),
  producto_id uuid not null references productos(id) on delete cascade,
  -- ruta dentro del bucket de Storage "productos"
  storage_path text not null,
  orden integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists producto_imagenes_producto_id_idx on producto_imagenes (producto_id, orden);

create table if not exists banners (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  subtitulo text,
  etiqueta text,
  -- ruta dentro del bucket de Storage "banners", opcional (los banners también pueden ser solo texto + color)
  imagen_path text,
  color_fondo text not null default '#9a3334',
  color_texto text not null default '#FFFFFF',
  orden integer not null default 0,
  activo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_updated_at on categorias;
create trigger set_updated_at before update on categorias
  for each row execute function set_updated_at();

drop trigger if exists set_updated_at on productos;
create trigger set_updated_at before update on productos
  for each row execute function set_updated_at();

drop trigger if exists set_updated_at on banners;
create trigger set_updated_at before update on banners
  for each row execute function set_updated_at();
