"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath, updateTag } from "next/cache";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

export async function toggleCategoryStatus(id: string, field: "activo" | "destacada", value: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("categorias")
    .update({ [field]: value })
    .eq("id", id);
    
  if (error) {
    console.error(`Error toggling ${field} for category ${id}:`, error);
    return { success: false, error: error.message };
  }
  
  revalidatePath("/admin/categorias");
  revalidatePath("/");
  revalidatePath("/productos");
  updateTag("categorias");

  return { success: true };
}

export async function deleteCategory(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("categorias")
    .delete()
    .eq("id", id);
    
  if (error) {
    console.error(`Error deleting category ${id}:`, error);
    return { success: false, error: error.message };
  }
  
  revalidatePath("/admin/categorias");
  revalidatePath("/");
  revalidatePath("/productos");
  updateTag("categorias");

  return { success: true };
}

export async function reorderCategories(orderedIds: string[]) {
  const supabase = await createClient();
  
  // Updating each item's order field
  const updates = orderedIds.map((id, index) => 
    supabase.from("categorias").update({ orden: index }).eq("id", id)
  );
  
  await Promise.all(updates);

  revalidatePath("/admin/categorias");
  revalidatePath("/");
  updateTag("categorias");
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
  let query = supabase.from("categorias").select("id").eq("slug", slug);
  if (idAExcluir) query = query.neq("id", idAExcluir);
  const { data } = await query.limit(1);
  return !data || data.length === 0;
}

/** Si el nombre ya está en uso por otra categoría, se agrega un número al final. */
async function generarSlugUnicoCategoria(
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

export async function saveCategory(formData: FormData, id?: string) {
  const supabase = await createClient();
  
  const nombre = formData.get("nombre") as string;
  const icono = formData.get("icono") as string || "HomeIcon";
  const destacada = formData.get("destacada") === "on";

  const slug = await generarSlugUnicoCategoria(supabase, nombre, id);

  const categoryData = {
    nombre,
    slug,
    icono,
    destacada,
  };

  if (id) {
    const { error: updateError } = await supabase
      .from("categorias")
      .update(categoryData)
      .eq("id", id);
      
    if (updateError) return { success: false, error: updateError.message };
  } else {
    // Determine the next max order
    const { data: maxOrderData } = await supabase
      .from("categorias")
      .select("orden")
      .order("orden", { ascending: false })
      .limit(1)
      .single();
      
    const nextOrder = maxOrderData ? maxOrderData.orden + 1 : 0;
    
    const { error: insertError } = await supabase
      .from("categorias")
      .insert([{ ...categoryData, orden: nextOrder, activo: true }]);
      
    if (insertError) return { success: false, error: insertError.message };
  }

  revalidatePath("/admin/categorias");
  revalidatePath("/");
  revalidatePath("/productos");
  updateTag("categorias");

  return { success: true };
}
