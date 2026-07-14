"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import * as OutlineIcons from "@heroicons/react/24/outline";

type CategoriaFormInitialData = {
  nombre?: string;
  icono?: string;
  destacada?: boolean;
};

type CategoriaFormProps = {
  initialData?: CategoriaFormInitialData;
  action: (formData: FormData) => Promise<{ success: boolean; error?: string }>;
};

type HeroIcon = React.ForwardRefExoticComponent<
  React.PropsWithoutRef<React.SVGProps<SVGSVGElement>> & {
    title?: string;
    titleId?: string;
  } & React.RefAttributes<SVGSVGElement>
>;

const Icons = OutlineIcons as unknown as Record<string, HeroIcon>;
const ICON_NAMES = Object.keys(OutlineIcons).filter((name) => name.endsWith("Icon"));

export function CategoriaForm({ initialData, action }: CategoriaFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedIcon, setSelectedIcon] = useState(initialData?.icono || "HomeIcon");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    formData.append("icono", selectedIcon);
    
    try {
      const result = await action(formData);
      if (result.success) {
        router.push("/admin/categorias");
        router.refresh();
      } else {
        setError(result.error || "Ocurrió un error al guardar la categoría");
      }
    } catch {
      setError("Error inesperado al enviar el formulario.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const SelectedIconComponent = Icons[selectedIcon];

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="nombre" className="text-sm font-medium">Nombre de la categoría *</label>
          <input
            id="nombre"
            name="nombre"
            defaultValue={initialData?.nombre}
            required
            className="w-full rounded-md border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          />
          <p className="text-xs text-muted-foreground">El slug (URL) se generará automáticamente a partir del nombre.</p>
        </div>

        <div className="space-y-2">
          <label htmlFor="icono" className="text-sm font-medium">Ícono (Heroicons)</label>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-md border bg-muted text-ink">
              {SelectedIconComponent ? <SelectedIconComponent className="h-6 w-6" /> : null}
            </div>
            <select
              id="icono"
              value={selectedIcon}
              onChange={(e) => setSelectedIcon(e.target.value)}
              className="flex-1 rounded-md border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            >
              {ICON_NAMES.map((iconName) => (
                <option key={iconName} value={iconName}>{iconName}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-4">
          <input
            type="checkbox"
            id="destacada"
            name="destacada"
            defaultChecked={initialData?.destacada}
            className="rounded border-input text-brand focus:ring-brand cursor-pointer"
          />
          <label htmlFor="destacada" className="text-sm font-medium cursor-pointer">
            Destacar categoría en la Home
          </label>
        </div>
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
          {isSubmitting ? "Guardando..." : "Guardar Categoría"}
        </button>
      </div>
    </form>
  );
}
