import { CategoriaForm } from "@/components/admin/categoria-form";
import { saveCategory } from "../actions";
import { createClient } from "@/lib/supabase/server";
import { CATEGORIAS_SEED } from "@/data/categorias.seed";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Editar Categoría - Administrar",
};

type Params = Promise<{ id: string }>;

export default async function EditarCategoriaPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  let categoria = null;

  if (!isSupabaseConfigured()) {
    const seedCat = CATEGORIAS_SEED.find((c) => c.id === id);
    if (seedCat) {
      categoria = seedCat;
    }
  } else {
    const supabase = await createClient();
    const { data } = await supabase
      .from("categorias")
      .select("*")
      .eq("id", id)
      .single();
      
    if (data) {
      categoria = data;
    }
  }

  if (!categoria) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-ink">Editar Categoría</h1>
        <p className="text-sm text-muted-foreground">
          Modifica los detalles de la categoría.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
        <CategoriaForm 
          initialData={categoria}
          action={async (formData) => {
            "use server";
            return saveCategory(formData, id);
          }} 
        />
      </div>
    </div>
  );
}
