import { SeccionForm } from "@/components/admin/seccion-form";
import { saveSeccion } from "../actions";

export const metadata = {
  title: "Nueva Sección - Administrar",
};

export default function NuevaSeccionPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-ink">Nueva Sección</h1>
        <p className="text-sm text-muted-foreground">
          Creá una nueva vitrina de productos para la home.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
        <SeccionForm
          action={async (formData) => {
            "use server";
            return saveSeccion(formData);
          }}
        />
      </div>
    </div>
  );
}
