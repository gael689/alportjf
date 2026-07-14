import { updateTag } from "next/cache";
import type { createClient } from "@/lib/supabase/server";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

/**
 * Reemplaza de una sola vez todas las secciones a las que pertenece un producto
 * (se llama desde saveProduct del alta/edición de producto).
 */
export async function setSeccionesDeProducto(
  supabase: SupabaseServerClient,
  productoId: string,
  seccionIds: string[]
) {
  await supabase.from("producto_secciones").delete().eq("producto_id", productoId);

  if (seccionIds.length > 0) {
    const rows = seccionIds.map((seccionId, index) => ({
      producto_id: productoId,
      seccion_id: seccionId,
      orden: index,
    }));
    await supabase.from("producto_secciones").insert(rows);
  }

  updateTag("secciones");
}
