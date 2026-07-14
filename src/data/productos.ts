import { unstable_cache } from "next/cache";
import type { Producto } from "@/data/types";
import { PRODUCTOS_SEED } from "@/data/productos.seed";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createPublicClient } from "@/lib/supabase/public-client";

const SELECT_PRODUCTO = "*, categorias(slug), producto_imagenes(storage_path, orden)";

type SupabasePublicClient = ReturnType<typeof createPublicClient>;

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

function resolveImagen(row: ProductoRow, supabase: SupabasePublicClient): string {
  const [principal] = [...row.producto_imagenes].sort((a, b) => a.orden - b.orden);
  if (principal) {
    return supabase.storage.from("productos").getPublicUrl(principal.storage_path).data
      .publicUrl;
  }
  // Sin fotos cargadas todavía: se muestra el ícono genérico de la categoría.
  const categoriaSlug = row.categorias?.slug ?? "bazar-hogar";
  return `/images/products/${categoriaSlug}.svg`;
}

function mapRow(row: ProductoRow, supabase: SupabasePublicClient): Producto {
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

async function fetchAllProductos(): Promise<Producto[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("productos")
    .select(SELECT_PRODUCTO)
    .eq("activo", true)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data as unknown as ProductoRow[]).map((row) => mapRow(row, supabase));
}

async function fetchProductoBySlug(slug: string): Promise<Producto | undefined> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("productos")
    .select(SELECT_PRODUCTO)
    .eq("slug", slug)
    .eq("activo", true)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return undefined;
  return mapRow(data as unknown as ProductoRow, supabase);
}

// Cache de datos de Next.js: sirve la misma respuesta durante `revalidate` segundos sin
// volver a golpear Supabase, y se invalida al instante cuando el panel guarda un cambio
// (revalidateTag("productos") en las server actions de /admin/productos).
const getCachedProductos = unstable_cache(fetchAllProductos, ["productos-activos"], {
  tags: ["productos"],
  revalidate: 300,
});

const getCachedProductoBySlug = unstable_cache(fetchProductoBySlug, ["producto-por-slug"], {
  tags: ["productos"],
  revalidate: 300,
});

/** Todos los productos activos. */
export async function getAllProductos(): Promise<Producto[]> {
  if (!isSupabaseConfigured()) return PRODUCTOS_SEED;
  try {
    return await getCachedProductos();
  } catch {
    return PRODUCTOS_SEED;
  }
}

export async function getProductoBySlug(slug: string): Promise<Producto | undefined> {
  if (!isSupabaseConfigured()) return PRODUCTOS_SEED.find((p) => p.slug === slug);
  try {
    return await getCachedProductoBySlug(slug);
  } catch {
    return PRODUCTOS_SEED.find((p) => p.slug === slug);
  }
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
