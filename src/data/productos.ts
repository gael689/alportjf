import type { Producto } from "@/data/types";
import { PRODUCTOS_SEED } from "@/data/productos.seed";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

const SELECT_PRODUCTO = "*, categorias(slug), producto_imagenes(storage_path, orden)";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

type ProductoRow = {
  id: string;
  slug: string;
  nombre: string;
  marca: string | null;
  descripcion: string;
  descripcion_larga: string | null;
  categoria_id: string;
  precio: number | string | null;
  precio_promo: number | string | null;
  oferta_hasta: string | null;
  destacado: boolean;
  nuevo: boolean;
  stock: number | null;
  categorias: { slug: string } | null;
  producto_imagenes: { storage_path: string; orden: number }[];
};

function resolveImagen(row: ProductoRow, supabase: SupabaseServerClient): string {
  const [principal] = [...row.producto_imagenes].sort((a, b) => a.orden - b.orden);
  if (principal) {
    return supabase.storage.from("productos").getPublicUrl(principal.storage_path).data
      .publicUrl;
  }
  // Sin fotos cargadas todavía: se muestra el ícono genérico de la categoría.
  const categoriaSlug = row.categorias?.slug ?? "bazar-hogar";
  return `/images/products/${categoriaSlug}.svg`;
}

function mapRow(row: ProductoRow, supabase: SupabaseServerClient): Producto {
  return {
    id: row.id,
    slug: row.slug,
    nombre: row.nombre,
    marca: row.marca ?? undefined,
    descripcion: row.descripcion,
    descripcionLarga: row.descripcion_larga ?? undefined,
    categoriaId: row.categoria_id,
    imagen: resolveImagen(row, supabase),
    precio: row.precio === null ? null : Number(row.precio),
    precioPromo: row.precio_promo === null ? undefined : Number(row.precio_promo),
    ofertaHasta: row.oferta_hasta ?? undefined,
    destacado: row.destacado,
    nuevo: row.nuevo,
    stock: row.stock ?? undefined,
  };
}

/** Todos los productos activos. */
export async function getAllProductos(): Promise<Producto[]> {
  if (!isSupabaseConfigured()) return PRODUCTOS_SEED;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("productos")
    .select(SELECT_PRODUCTO)
    .eq("activo", true)
    .order("created_at", { ascending: false });

  if (error || !data) return PRODUCTOS_SEED;
  return (data as ProductoRow[]).map((row) => mapRow(row, supabase));
}

export async function getProductoBySlug(slug: string): Promise<Producto | undefined> {
  if (!isSupabaseConfigured()) return PRODUCTOS_SEED.find((p) => p.slug === slug);

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("productos")
    .select(SELECT_PRODUCTO)
    .eq("slug", slug)
    .eq("activo", true)
    .maybeSingle();

  if (error || !data) return undefined;
  return mapRow(data as ProductoRow, supabase);
}

export async function getProductosByCategoria(categoriaId: string): Promise<Producto[]> {
  const todos = await getAllProductos();
  return todos.filter((p) => p.categoriaId === categoriaId);
}

export async function getDestacados(): Promise<Producto[]> {
  const todos = await getAllProductos();
  return todos.filter((p) => p.destacado);
}

export async function getNuevos(): Promise<Producto[]> {
  const todos = await getAllProductos();
  return todos.filter((p) => p.nuevo);
}

function tieneOfertaActiva(p: Producto): boolean {
  if (p.precio === null || !p.precioPromo || p.precioPromo >= p.precio) return false;
  if (p.ofertaHasta && new Date(p.ofertaHasta).getTime() <= Date.now()) return false;
  return true;
}

/**
 * Productos recomendados para la ficha de producto ("También te puede interesar").
 * Prioriza la misma categoría, pero siempre incluye al menos un producto en oferta
 * activa si existe alguno en el catálogo (para incentivar la venta).
 */
export async function getRecomendados(
  producto: Producto,
  cantidad = 4
): Promise<Producto[]> {
  const todos = await getAllProductos();
  const candidatos = todos.filter((p) => p.id !== producto.id);

  const porOferta = (a: Producto, b: Producto) =>
    Number(tieneOfertaActiva(b)) - Number(tieneOfertaActiva(a));

  const mismaCategoria = candidatos
    .filter((p) => p.categoriaId === producto.categoriaId)
    .sort(porOferta);
  const otrasCategorias = candidatos
    .filter((p) => p.categoriaId !== producto.categoriaId)
    .sort(porOferta);

  const ordenados = [...mismaCategoria, ...otrasCategorias];
  const seleccion = ordenados.slice(0, cantidad);

  if (seleccion.length === cantidad && !seleccion.some(tieneOfertaActiva)) {
    const conOferta = ordenados.find(
      (p) => tieneOfertaActiva(p) && !seleccion.includes(p)
    );
    if (conOferta) seleccion[seleccion.length - 1] = conOferta;
  }

  return seleccion;
}
