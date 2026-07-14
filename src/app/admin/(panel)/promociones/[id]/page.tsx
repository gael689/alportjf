import { BannerForm } from "@/components/admin/banner-form";
import { saveBanner } from "../actions";
import { createClient } from "@/lib/supabase/server";
import { BANNERS_SEED } from "@/data/banners.seed";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Editar Banner - Administrar",
};

type Params = Promise<{ id: string }>;

export default async function EditarBannerPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  let banner = null;

  if (!isSupabaseConfigured()) {
    const seedBanner = BANNERS_SEED.find((b) => b.id === id);
    if (seedBanner) {
      banner = {
        ...seedBanner,
        color_fondo: seedBanner.colorFondo,
        color_texto: seedBanner.colorTexto,
        imagen_path: seedBanner.imagenUrl,
      };
    }
  } else {
    const supabase = await createClient();
    const { data } = await supabase
      .from("banners")
      .select("*")
      .eq("id", id)
      .single();
      
    if (data) {
      banner = data;
    }
  }

  if (!banner) {
    notFound();
  }
  
  // Format to match what BannerForm expects
  const initialData = {
    titulo: banner.titulo,
    subtitulo: banner.subtitulo,
    etiqueta: banner.etiqueta,
    colorFondo: banner.color_fondo,
    colorTexto: banner.color_texto,
    imagenUrl: banner.imagen_path,
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-ink">Editar Banner</h1>
        <p className="text-sm text-muted-foreground">
          Modifica los detalles del banner promocional.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
        <BannerForm 
          initialData={initialData}
          action={async (formData) => {
            "use server";
            return saveBanner(formData, id);
          }} 
        />
      </div>
    </div>
  );
}
