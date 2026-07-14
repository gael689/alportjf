import { SeccionList } from "./seccion-list";
import { getAllSeccionesAdmin } from "@/data/secciones";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const metadata = {
  title: "Administrar Secciones - Alport JF",
};

export default async function AdminSeccionesPage() {
  const secciones = isSupabaseConfigured() ? await getAllSeccionesAdmin() : [];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-ink">Secciones de la home</h1>
        <p className="text-sm text-muted-foreground">
          Las vitrinas de productos que aparecen en la página de inicio (ej. &quot;Productos
          destacados&quot;, &quot;Lo más nuevo&quot;). Creá las que quieras y elegí qué productos
          van en cada una desde el alta o edición de cada producto.
        </p>
      </div>

      {!isSupabaseConfigured() && (
        <div className="rounded-md bg-amber-50 p-4 text-sm text-amber-800">
          Conectá Supabase para poder crear y administrar secciones.
        </div>
      )}

      <SeccionList initialSecciones={secciones} />
    </div>
  );
}
