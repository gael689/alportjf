"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type SeccionFormInitialData = {
  nombre?: string;
  subtitulo?: string;
};

type SeccionFormProps = {
  initialData?: SeccionFormInitialData;
  action: (formData: FormData) => Promise<{ success: boolean; error?: string }>;
};

export function SeccionForm({ initialData, action }: SeccionFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      const result = await action(formData);
      if (result.success) {
        router.push("/admin/secciones");
        router.refresh();
      } else {
        setError(result.error || "Ocurrió un error al guardar la sección");
      }
    } catch {
      setError("Error inesperado al enviar el formulario.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}

      <div className="space-y-2">
        <label htmlFor="nombre" className="text-sm font-medium">Nombre de la sección *</label>
        <input
          id="nombre"
          name="nombre"
          defaultValue={initialData?.nombre}
          required
          placeholder="Ej: Lo último, Ofertas de la semana, Ideal para regalar"
          className="w-full rounded-md border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
        />
        <p className="text-xs text-muted-foreground">Así se va a ver el título arriba de la vitrina en la home.</p>
      </div>

      <div className="space-y-2">
        <label htmlFor="subtitulo" className="text-sm font-medium">Subtítulo (opcional)</label>
        <input
          id="subtitulo"
          name="subtitulo"
          defaultValue={initialData?.subtitulo}
          placeholder="Ej: Renovamos el catálogo todas las semanas"
          className="w-full rounded-md border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
        />
      </div>

      <div className="rounded-md bg-muted/60 p-4 text-sm text-muted-foreground">
        Para elegir qué productos aparecen acá, entrá a cada producto (Productos → editar) y
        tildá esta sección en &quot;Secciones de la home&quot;.
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
          disabled={isSubmitting}
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand/90 disabled:opacity-50"
        >
          {isSubmitting ? "Guardando..." : "Guardar Sección"}
        </button>
      </div>
    </form>
  );
}
