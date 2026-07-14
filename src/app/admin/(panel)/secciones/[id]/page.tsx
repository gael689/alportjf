import { notFound } from "next/navigation";
import { SeccionForm } from "@/components/admin/seccion-form";
import { saveSeccion } from "../actions";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Editar Sección - Administrar",
};

type Params = Promise<{ id: string }>;

export default async function EditarSeccionPage({ params }: { params: Params }) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: seccion } = await supabase
    .from("secciones")
    .select("nombre, subtitulo")
    .eq("id", id)
    .single();

  if (!seccion) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-ink">Editar Sección</h1>
        <p className="text-sm text-muted-foreground">Modificá el nombre o subtítulo de la vitrina.</p>
      </div>

      <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
        <SeccionForm
          initialData={{ nombre: seccion.nombre, subtitulo: seccion.subtitulo ?? undefined }}
          action={async (formData) => {
            "use server";
            return saveSeccion(formData, id);
          }}
        />
      </div>
    </div>
  );
}
