import { createClient } from "@/lib/supabase/server";
import { BannerList, type BannerListItem } from "./banner-list";
import { BANNERS_SEED } from "@/data/banners.seed";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const metadata = {
  title: "Administrar Promociones - Alport JF",
};

export default async function AdminPromocionesPage() {
  let banners: BannerListItem[] = [];
  
  if (!isSupabaseConfigured()) {
    banners = BANNERS_SEED.map((b, index) => ({
      id: b.id,
      titulo: b.titulo,
      etiqueta: b.etiqueta || "",
      color_fondo: b.colorFondo,
      color_texto: b.colorTexto,
      imagen_path: b.imagenUrl || null,
      activo: b.activo,
      orden: index,
    }));
  } else {
    const supabase = await createClient();
    const { data } = await supabase
      .from("banners")
      .select("*")
      .order("orden", { ascending: true });
      
    if (data) {
      banners = data;
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-ink">Promociones</h1>
        <p className="text-sm text-muted-foreground">
          Gestiona los banners promocionales que aparecen en el carrusel de la página principal.
        </p>
      </div>

      <BannerList initialBanners={banners} />
    </div>
  );
}
