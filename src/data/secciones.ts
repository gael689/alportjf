import { unstable_cache } from "next/cache";
import type { Producto, Seccion } from "@/data/types";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createPublicClient } from "@/lib/supabase/public-client";
import { createClient } from "@/lib/supabase/server";
import { getAllProductos } from "@/data/productos";

type SeccionRow = {
  id: string;
  slug: string;
  nombre: string;
  subtitulo: string | null;
  orden: number;
  activo: boolean;
};

type ProductoSeccionRow = {
  producto_id: string;
  seccion_id: string;
  orden: number;
};

function mapSeccionRow(row: SeccionRow): Seccion {
  return {
    id: row.id,
    slug: row.slug,
    nombre: row.nombre,
    subtitulo: row.subtitulo ?? undefined,
    orden: row.orden,
    activo: row.activo,
  };
}

async function fetchSeccionesActivas(): Promise<Seccion[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("secciones")
    .select("id, slug, nombre, subtitulo, orden, activo")
    .eq("activo", true)
    .order("orden", { ascending: true });

  if (error) throw new Error(error.message);
  return (data as SeccionRow[]).map(mapSeccionRow);
}

async function fetchProductoSecciones(): Promise<ProductoSeccionRow[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("producto_secciones")
    .select("producto_id, seccion_id, orden")
    .order("orden", { ascending: true });

  if (error) throw new Error(error.message);
  return data as ProductoSeccionRow[];
}

const getCachedSecciones = unstable_cache(fetchSeccionesActivas, ["secciones-activas"], {
  tags: ["secciones"],
  revalidate: 300,
});

const getCachedProductoSecciones = unstable_cache(
  fetchProductoSecciones,
  ["producto-secciones"],
  { tags: ["secciones", "productos"], revalidate: 300 }
);

/** Secciones activas de la home, en el orden definido desde el panel. */
export async function getSeccionesActivas(): Promise<Seccion[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    return await getCachedSecciones();
  } catch {
    return [];
  }
}

export type SeccionConProductos = { seccion: Seccion; productos: Producto[] };

/**
 * Secciones de la home con sus productos ya resueltos, listas para renderizar.
 * Se arma en memoria a partir de 3 lecturas cacheadas (secciones, asignaciones y
 * catálogo) en vez de hacer una consulta por sección, para que agregar una vitrina
 * nueva desde el panel no le sume una query extra a la home.
 */
export async function getHomeSections(limitPorSeccion = 8): Promise<SeccionConProductos[]> {
  if (!isSupabaseConfigured()) return [];

  const [secciones, asignaciones, productos] = await Promise.all([
    getSeccionesActivas(),
    getCachedProductoSecciones().catch(() => [] as ProductoSeccionRow[]),
    getAllProductos(),
  ]);

  if (secciones.length === 0 || asignaciones.length === 0) return [];

  const productosPorId = new Map(productos.map((p) => [p.id, p]));

  return secciones
    .map((seccion) => {
      const productosDeSeccion = asignaciones
        .filter((a) => a.seccion_id === seccion.id)
        .sort((a, b) => a.orden - b.orden)
        .map((a) => productosPorId.get(a.producto_id))
        .filter((p): p is Producto => Boolean(p))
        .slice(0, limitPorSeccion);
      return { seccion, productos: productosDeSeccion };
    })
    .filter((s) => s.productos.length > 0);
}

/** Todas las secciones (incluidas inactivas), para el panel de administración. */
export async function getAllSeccionesAdmin(): Promise<Seccion[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("secciones")
    .select("id, slug, nombre, subtitulo, orden, activo")
    .order("orden", { ascending: true });

  if (error || !data) return [];
  return (data as SeccionRow[]).map(mapSeccionRow);
}

/** Productos de una sección puntual (usado por "Ver todo" desde la home hacia el catálogo). */
export async function getProductosPorSeccionSlug(slug: string): Promise<Producto[]> {
  const home = await getHomeSections(9999);
  return home.find((h) => h.seccion.slug === slug)?.productos ?? [];
}

/** ids de las secciones a las que pertenece un producto, para pre-marcar los checkboxes del form. */
export async function getSeccionIdsDeProducto(productoId: string): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("producto_secciones")
    .select("seccion_id")
    .eq("producto_id", productoId);

  if (error || !data) return [];
  return data.map((row) => row.seccion_id as string);
}
