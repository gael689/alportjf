import type { Categoria } from "@/data/types";
import { CATEGORIAS_SEED } from "@/data/categorias.seed";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

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

/** Todas las categorías activas, en el orden definido desde el panel. */
export async function getAllCategorias(): Promise<Categoria[]> {
  if (!isSupabaseConfigured()) return CATEGORIAS_SEED;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categorias")
    .select("id, slug, nombre, icono, destacada, activo")
    .eq("activo", true)
    .order("orden", { ascending: true });

  if (error || !data) return CATEGORIAS_SEED;
  return data.map(mapRow);
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
