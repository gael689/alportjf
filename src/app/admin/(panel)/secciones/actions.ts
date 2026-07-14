"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath, updateTag } from "next/cache";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

function revalidarSecciones() {
  revalidatePath("/admin/secciones");
  revalidatePath("/");
  revalidatePath("/productos");
  updateTag("secciones");
}

export async function toggleSeccionStatus(id: string, value: boolean) {
  const supabase = await createClient();
  const { error } = await supabase.from("secciones").update({ activo: value }).eq("id", id);

  if (error) {
    console.error(`Error toggling activo for seccion ${id}:`, error);
    return { success: false, error: error.message };
  }

  revalidarSecciones();
  return { success: true };
}

export async function deleteSeccion(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("secciones").delete().eq("id", id);

  if (error) {
    console.error(`Error deleting seccion ${id}:`, error);
    return { success: false, error: error.message };
  }

  revalidarSecciones();
  return { success: true };
}

export async function reorderSecciones(orderedIds: string[]) {
  const supabase = await createClient();
  const updates = orderedIds.map((id, index) =>
    supabase.from("secciones").update({ orden: index }).eq("id", id)
  );
  await Promise.all(updates);

  revalidarSecciones();
  return { success: true };
}

function generateSlug(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

async function slugDisponible(
  supabase: SupabaseServerClient,
  slug: string,
  idAExcluir?: string
): Promise<boolean> {
  let query = supabase.from("secciones").select("id").eq("slug", slug);
  if (idAExcluir) query = query.neq("id", idAExcluir);
  const { data } = await query.limit(1);
  return !data || data.length === 0;
}

async function generarSlugUnicoSeccion(
  supabase: SupabaseServerClient,
  nombre: string,
  idAExcluir?: string
): Promise<string> {
  const base = generateSlug(nombre);
  if (await slugDisponible(supabase, base, idAExcluir)) return base;

  let intento = 2;
  let candidato = `${base}-${intento}`;
  while (!(await slugDisponible(supabase, candidato, idAExcluir))) {
    intento++;
    candidato = `${base}-${intento}`;
  }
  return candidato;
}

export async function saveSeccion(formData: FormData, id?: string) {
  const supabase = await createClient();

  const nombre = formData.get("nombre") as string;
  const subtitulo = (formData.get("subtitulo") as string) || null;
  const slug = await generarSlugUnicoSeccion(supabase, nombre, id);

  const seccionData = { nombre, subtitulo, slug };

  if (id) {
    const { error } = await supabase.from("secciones").update(seccionData).eq("id", id);
    if (error) return { success: false, error: error.message };
  } else {
    const { data: maxOrderData } = await supabase
      .from("secciones")
      .select("orden")
      .order("orden", { ascending: false })
      .limit(1)
      .single();

    const nextOrder = maxOrderData ? maxOrderData.orden + 1 : 0;
    const { error } = await supabase
      .from("secciones")
      .insert([{ ...seccionData, orden: nextOrder, activo: true }]);
    if (error) return { success: false, error: error.message };
  }

  revalidarSecciones();
  return { success: true };
}
