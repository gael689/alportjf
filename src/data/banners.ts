import { unstable_cache } from "next/cache";
import type { PromoBanner } from "@/data/types";
import { BANNERS_SEED } from "@/data/banners.seed";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createPublicClient } from "@/lib/supabase/public-client";

type BannerRow = {
  id: string;
  titulo: string;
  subtitulo: string | null;
  etiqueta: string | null;
  imagen_path: string | null;
  color_fondo: string;
  color_texto: string;
  orden: number;
  activo: boolean;
};

async function fetchAllBanners(): Promise<PromoBanner[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("banners")
    .select("*")
    .eq("activo", true)
    .order("orden", { ascending: true });

  if (error) throw new Error(error.message);

  return (data as BannerRow[]).map((row) => ({
    id: row.id,
    titulo: row.titulo,
    subtitulo: row.subtitulo ?? undefined,
    etiqueta: row.etiqueta ?? undefined,
    imagenUrl: row.imagen_path
      ? supabase.storage.from("banners").getPublicUrl(row.imagen_path).data.publicUrl
      : undefined,
    colorFondo: row.color_fondo,
    colorTexto: row.color_texto,
    orden: row.orden,
    activo: row.activo,
  }));
}

const getCachedBanners = unstable_cache(fetchAllBanners, ["banners-activos"], {
  tags: ["banners"],
  revalidate: 300,
});

/** Todos los banners activos, ordenados como se definió desde el panel. */
export async function getAllBanners(): Promise<PromoBanner[]> {
  if (!isSupabaseConfigured()) return BANNERS_SEED;
  try {
    return await getCachedBanners();
  } catch {
    return BANNERS_SEED;
  }
}
