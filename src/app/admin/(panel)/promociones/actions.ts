"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath, updateTag } from "next/cache";

export async function toggleBannerStatus(id: string, field: "activo", value: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("banners")
    .update({ [field]: value })
    .eq("id", id);
    
  if (error) {
    console.error(`Error toggling ${field} for banner ${id}:`, error);
    return { success: false, error: error.message };
  }
  
  revalidatePath("/admin/promociones");
  revalidatePath("/");
  updateTag("banners");
  
  return { success: true };
}

// Los banners de ejemplo usan rutas locales (/images/...) o URLs completas,
// no paths reales de Supabase Storage: no hay que intentar borrarlas del bucket.
function esStoragePath(path: string): boolean {
  return !path.startsWith("http") && !path.startsWith("/");
}

export async function deleteBanner(id: string) {
  const supabase = await createClient();

  const { data: banner } = await supabase
    .from("banners")
    .select("imagen_path")
    .eq("id", id)
    .single();

  const { error } = await supabase
    .from("banners")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(`Error deleting banner ${id}:`, error);
    return { success: false, error: error.message };
  }

  if (banner?.imagen_path && esStoragePath(banner.imagen_path)) {
    await supabase.storage.from("banners").remove([banner.imagen_path]);
  }

  revalidatePath("/admin/promociones");
  revalidatePath("/");
  updateTag("banners");

  return { success: true };
}

export async function reorderBanners(orderedIds: string[]) {
  const supabase = await createClient();
  
  const updates = orderedIds.map((id, index) => 
    supabase.from("banners").update({ orden: index }).eq("id", id)
  );
  
  await Promise.all(updates);

  revalidatePath("/admin/promociones");
  revalidatePath("/");
  updateTag("banners");
  return { success: true };
}

export async function saveBanner(formData: FormData, id?: string) {
  const supabase = await createClient();
  
  const titulo = formData.get("titulo") as string;
  const subtitulo = (formData.get("subtitulo") as string) || null;
  const etiqueta = (formData.get("etiqueta") as string) || null;
  const color_fondo = formData.get("colorFondo") as string || "#9a3334";
  const color_texto = formData.get("colorTexto") as string || "#FFFFFF";
  const imagen_path = (formData.get("imagenUrl") as string) || null;
  
  const bannerData = {
    titulo,
    subtitulo,
    etiqueta,
    color_fondo,
    color_texto,
    imagen_path,
  };

  if (id) {
    const { data: bannerPrevio } = await supabase
      .from("banners")
      .select("imagen_path")
      .eq("id", id)
      .single();

    const { error: updateError } = await supabase
      .from("banners")
      .update(bannerData)
      .eq("id", id);

    if (updateError) return { success: false, error: updateError.message };

    const pathPrevio = bannerPrevio?.imagen_path;
    if (pathPrevio && esStoragePath(pathPrevio) && pathPrevio !== imagen_path) {
      await supabase.storage.from("banners").remove([pathPrevio]);
    }
  } else {
    const { data: maxOrderData } = await supabase
      .from("banners")
      .select("orden")
      .order("orden", { ascending: false })
      .limit(1)
      .single();
      
    const nextOrder = maxOrderData ? maxOrderData.orden + 1 : 0;
    
    const { error: insertError } = await supabase
      .from("banners")
      .insert([{ ...bannerData, orden: nextOrder, activo: true }]);
      
    if (insertError) return { success: false, error: insertError.message };
  }

  revalidatePath("/admin/promociones");
  revalidatePath("/");
  updateTag("banners");
  
  return { success: true };
}
