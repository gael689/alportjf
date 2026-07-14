import { createClient } from "@/lib/supabase/server";
import { CategoryList, type CategoryListItem } from "./category-list";
import { CATEGORIAS_SEED } from "@/data/categorias.seed";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const metadata = {
  title: "Administrar Categorías - Alport JF",
};

export default async function AdminCategoriasPage() {
  let categories: CategoryListItem[] = [];
  
  if (!isSupabaseConfigured()) {
    categories = CATEGORIAS_SEED.map((c, index) => ({
      id: c.id,
      nombre: c.nombre,
      icono: c.icono,
      activo: c.activo,
      destacada: c.destacada,
      orden: index,
    }));
  } else {
    const supabase = await createClient();
    const { data } = await supabase
      .from("categorias")
      .select("id, nombre, icono, activo, destacada, orden")
      .order("orden", { ascending: true });
      
    if (data) {
      categories = data;
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-ink">Categorías</h1>
        <p className="text-sm text-muted-foreground">
          Gestiona las categorías del catálogo y su orden.
        </p>
      </div>

      <CategoryList initialCategories={categories} />
    </div>
  );
}
