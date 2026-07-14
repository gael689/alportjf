"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUploader } from "./image-uploader";

type Categoria = {
  id: string;
  nombre: string;
};

type Seccion = {
  id: string;
  nombre: string;
};

type ProductoFormInitialData = {
  nombre?: string;
  marca?: string;
  categoriaId?: string;
  descripcion?: string;
  descripcionLarga?: string;
  precio?: number | null;
  precioPromo?: number;
  ofertaHasta?: string;
  stock?: number;
  destacado?: boolean;
  nuevo?: boolean;
  imagenes?: { url: string }[];
  seccionIds?: string[];
};

type ProductoFormProps = {
  initialData?: ProductoFormInitialData;
  categorias: Categoria[];
  secciones?: Seccion[];
  action: (formData: FormData) => Promise<{ success: boolean; error?: string }>;
};

export function ProductoForm({ initialData, categorias, secciones = [], action }: ProductoFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [sinPrecio, setSinPrecio] = useState(initialData?.precio === null);
  const [imagenes, setImagenes] = useState<{ url: string; file?: File; isNew?: boolean }[]>(
    initialData?.imagenes || []
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    
    // Add images data
    // Usually handled by appending files or image paths to formData
    
    try {
      const result = await action(formData);
      if (result.success) {
        router.push("/admin/productos");
        router.refresh();
      } else {
        setError(result.error || "Ocurrió un error al guardar el producto");
      }
    } catch {
      setError("Error inesperado al enviar el formulario.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <label htmlFor="nombre" className="text-sm font-medium">Nombre del producto *</label>
          <input
            id="nombre"
            name="nombre"
            defaultValue={initialData?.nombre}
            required
            className="w-full rounded-md border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="marca" className="text-sm font-medium">Marca</label>
          <input
            id="marca"
            name="marca"
            defaultValue={initialData?.marca}
            className="w-full rounded-md border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="categoriaId" className="text-sm font-medium">Categoría *</label>
          <select
            id="categoriaId"
            name="categoriaId"
            defaultValue={initialData?.categoriaId || ""}
            required
            className="w-full rounded-md border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          >
            <option value="" disabled>Seleccionar categoría</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <label htmlFor="descripcion" className="text-sm font-medium">Descripción breve *</label>
          <textarea
            id="descripcion"
            name="descripcion"
            defaultValue={initialData?.descripcion}
            required
            rows={2}
            className="w-full rounded-md border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label htmlFor="descripcionLarga" className="text-sm font-medium">Descripción larga (opcional)</label>
          <textarea
            id="descripcionLarga"
            name="descripcionLarga"
            defaultValue={initialData?.descripcionLarga}
            rows={4}
            className="w-full rounded-md border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>
      </div>

      <div className="space-y-4 rounded-lg border bg-card p-4">
        <h3 className="font-semibold text-lg">Precio y Ofertas</h3>
        
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="sinPrecio"
            name="sinPrecio"
            checked={sinPrecio}
            onChange={(e) => setSinPrecio(e.target.checked)}
            className="rounded border-input text-brand focus:ring-brand cursor-pointer"
          />
          <label htmlFor="sinPrecio" className="text-sm font-medium cursor-pointer">
            Sin precio (mostrar &quot;Consultar precio&quot;)
          </label>
        </div>

        {!sinPrecio && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 pt-2">
            <div className="space-y-2">
              <label htmlFor="precio" className="text-sm font-medium">Precio normal (ARS) *</label>
              <input
                id="precio"
                name="precio"
                type="number"
                min="0"
                step="0.01"
                defaultValue={initialData?.precio ?? undefined}
                required={!sinPrecio}
                className="w-full rounded-md border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="precioPromo" className="text-sm font-medium">Precio promocional</label>
              <input
                id="precioPromo"
                name="precioPromo"
                type="number"
                min="0"
                step="0.01"
                defaultValue={initialData?.precioPromo}
                className="w-full rounded-md border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="ofertaHasta" className="text-sm font-medium">Vencimiento de oferta</label>
              <input
                id="ofertaHasta"
                name="ofertaHasta"
                type="datetime-local"
                defaultValue={initialData?.ofertaHasta ? new Date(initialData.ofertaHasta).toISOString().slice(0,16) : ""}
                className="w-full rounded-md border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4 rounded-lg border bg-card p-4">
        <h3 className="font-semibold text-lg">Estado e Inventario</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label htmlFor="stock" className="text-sm font-medium">Stock disponible</label>
            <input
              id="stock"
              name="stock"
              type="number"
              min="0"
              defaultValue={initialData?.stock}
              className="w-full rounded-md border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
          
          <div className="flex items-center gap-2 pt-6">
            <input
              type="checkbox"
              id="destacado"
              name="destacado"
              defaultChecked={initialData?.destacado}
              className="rounded border-input text-brand focus:ring-brand cursor-pointer"
            />
            <label htmlFor="destacado" className="text-sm font-medium cursor-pointer">
              Destacar en la home
            </label>
          </div>
          
          <div className="flex items-center gap-2 pt-6">
            <input
              type="checkbox"
              id="nuevo"
              name="nuevo"
              defaultChecked={initialData?.nuevo}
              className="rounded border-input text-brand focus:ring-brand cursor-pointer"
            />
            <label htmlFor="nuevo" className="text-sm font-medium cursor-pointer">
              Marcar como &quot;Nuevo&quot;
            </label>
          </div>
        </div>
      </div>

      {secciones.length > 0 && (
        <div className="space-y-3 rounded-lg border bg-card p-4">
          <h3 className="font-semibold text-lg">Secciones de la home</h3>
          <p className="text-sm text-muted-foreground">
            Elegí en qué vitrinas de la página de inicio aparece este producto. Se pueden
            crear y renombrar secciones nuevas desde &quot;Secciones home&quot; en el menú.
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            {secciones.map((s) => (
              <label
                key={s.id}
                className="flex items-center gap-2 rounded-md border border-input px-3 py-2 text-sm cursor-pointer hover:bg-muted"
              >
                <input
                  type="checkbox"
                  name="seccionIds"
                  value={s.id}
                  defaultChecked={initialData?.seccionIds?.includes(s.id)}
                  className="rounded border-input text-brand focus:ring-brand cursor-pointer"
                />
                {s.nombre}
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4 rounded-lg border bg-card p-4">
        <h3 className="font-semibold text-lg">Imágenes</h3>
        <p className="text-sm text-muted-foreground">Sube las imágenes del producto. La primera se usará como portada.</p>
        <ImageUploader 
          imagenes={imagenes} 
          onChange={setImagenes} 
        />
        {/* Hidden input to pass the final images JSON to the server action */}
        <input type="hidden" name="imagenes" value={JSON.stringify(imagenes.map(i => i.url))} />
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
          {isSubmitting ? "Guardando..." : "Guardar Producto"}
        </button>
      </div>
    </form>
  );
}
