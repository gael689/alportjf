import { unstable_cache } from "next/cache";
import type { Categoria } from "@/data/types";
import { CATEGORIAS_SEED } from "@/data/categorias.seed";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createPublicClient } from "@/lib/supabase/public-client";

type CategoriaRow = {
  id: string;
  slug: string;
  nombre: string;
  icono: string;
  destacada: boolean;
  activo: boolean;
};

function mapRow(row: CategoriaRow): Categoria {
  return {
    id: row.id,
    slug: row.slug,
    nombre: row.nombre,
    icono: row.icono,
    destacada: row.destacada,
    activo: row.activo,
  };
}

async function fetchAllCategorias(): Promise<Categoria[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("categorias")
    .select("id, slug, nombre, icono, destacada, activo")
    .eq("activo", true)
    .order("orden", { ascending: true });

  if (error) throw new Error(error.message);
  return (data as CategoriaRow[]).map(mapRow);
}

const getCachedCategorias = unstable_cache(fetchAllCategorias, ["categorias-activas"], {
  tags: ["categorias"],
  revalidate: 300,
});

/** Todas las categorías activas, en el orden definido desde el panel. */
export async function getAllCategorias(): Promise<Categoria[]> {
  if (!isSupabaseConfigured()) return CATEGORIAS_SEED;
  try {
    return await getCachedCategorias();
  } catch {
    return CATEGORIAS_SEED;
  }
}

export async function getCategoriasDestacadas(): Promise<Categoria[]> {
  const todas = await getAllCategorias();
  return todas.filter((c) => c.destacada);
}

export async function getCategoriaBySlug(slug: string): Promise<Categoria | undefined> {
  const todas = await getAllCategorias();
  return todas.find((c) => c.slug === slug);
}

export async function getCategoriaById(id: string): Promise<Categoria | undefined> {
  const todas = await getAllCategorias();
  return todas.find((c) => c.id === id);
}
