import { CategoriaForm } from "@/components/admin/categoria-form";
import { saveCategory } from "../actions";

export const metadata = {
  title: "Nueva Categoría - Administrar",
};

export default function NuevaCategoriaPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-ink">Nueva Categoría</h1>
        <p className="text-sm text-muted-foreground">
          Crea una nueva categoría para organizar los productos.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
        <CategoriaForm 
          action={async (formData) => {
            "use server";
            return saveCategory(formData);
          }} 
        />
      </div>
    </div>
  );
}
