import { ProductoForm } from "@/components/admin/producto-form";
import { saveProduct } from "../actions";
import { createClient } from "@/lib/supabase/server";
import { CATEGORIAS_SEED } from "@/data/categorias.seed";
import { getAllSeccionesAdmin } from "@/data/secciones";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const metadata = {
  title: "Nuevo Producto - Administrar",
};

export default async function NuevoProductoPage() {
  let categorias: { id: string; nombre: string }[] = [];
  let secciones: { id: string; nombre: string }[] = [];

  if (!isSupabaseConfigured()) {
    categorias = CATEGORIAS_SEED;
  } else {
    const supabase = await createClient();
    const { data } = await supabase.from("categorias").select("id, nombre").eq("activo", true);
    if (data) categorias = data;
    secciones = await getAllSeccionesAdmin();
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-ink">Nuevo Producto</h1>
        <p className="text-sm text-muted-foreground">
          Carga un nuevo producto en el catálogo.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
        <ProductoForm
          categorias={categorias}
          secciones={secciones}
          action={async (formData) => {
            "use server";
            return saveProduct(formData);
          }}
        />
      </div>
    </div>
  );
}
