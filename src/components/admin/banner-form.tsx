"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { TrashIcon } from "@heroicons/react/24/outline";

type BannerFormInitialData = {
  titulo?: string;
  subtitulo?: string;
  etiqueta?: string;
  colorFondo?: string;
  colorTexto?: string;
  imagenUrl?: string;
};

type BannerFormProps = {
  initialData?: BannerFormInitialData;
  action: (formData: FormData) => Promise<{ success: boolean; error?: string }>;
};

export function BannerForm({ initialData, action }: BannerFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const [titulo, setTitulo] = useState(initialData?.titulo || "");
  const [subtitulo, setSubtitulo] = useState(initialData?.subtitulo || "");
  const [etiqueta, setEtiqueta] = useState(initialData?.etiqueta || "");
  const [colorFondo, setColorFondo] = useState(initialData?.colorFondo || "#9a3334");
  const [colorTexto, setColorTexto] = useState(initialData?.colorTexto || "#FFFFFF");
  const [imagenUrl, setImagenUrl] = useState(initialData?.imagenUrl || "");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const supabase = createClient();
    const file = files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data, error } = await supabase.storage
      .from("banners")
      .upload(filePath, file);

    if (error) {
      console.error("Error uploading banner image:", error);
      alert(`Error al subir la imagen ${file.name}`);
    } else if (data) {
      setImagenUrl(data.path);
    }

    setIsUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  };
  
  const resolvedImageUrl = (() => {
    if (!imagenUrl) return undefined;
    if (imagenUrl.startsWith("http") || imagenUrl.startsWith("/")) return imagenUrl;
    const supabase = createClient();
    return supabase.storage.from("banners").getPublicUrl(imagenUrl).data.publicUrl;
  })();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    formData.append("imagenUrl", imagenUrl);
    
    try {
      const result = await action(formData);
      if (result.success) {
        router.push("/admin/promociones");
        router.refresh();
      } else {
        setError(result.error || "Ocurrió un error al guardar el banner");
      }
    } catch {
      setError("Error inesperado al enviar el formulario.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="titulo" className="text-sm font-medium">Título *</label>
            <input
              id="titulo"
              name="titulo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
              className="w-full rounded-md border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="subtitulo" className="text-sm font-medium">Subtítulo</label>
            <input
              id="subtitulo"
              name="subtitulo"
              value={subtitulo}
              onChange={(e) => setSubtitulo(e.target.value)}
              className="w-full rounded-md border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="etiqueta" className="text-sm font-medium">Etiqueta (ej. 🔥 Oferta)</label>
            <input
              id="etiqueta"
              name="etiqueta"
              value={etiqueta}
              onChange={(e) => setEtiqueta(e.target.value)}
              className="w-full rounded-md border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="colorFondo" className="text-sm font-medium">Color de Fondo</label>
              <div className="flex gap-2">
                <input
                  id="colorFondo"
                  name="colorFondo"
                  type="color"
                  value={colorFondo.startsWith("var") ? "#9a3334" : colorFondo} // Fallback if using css vars from seed
                  onChange={(e) => setColorFondo(e.target.value)}
                  className="h-10 w-12 cursor-pointer rounded bg-transparent p-1"
                />
                <input
                  type="text"
                  value={colorFondo}
                  onChange={(e) => setColorFondo(e.target.value)}
                  className="flex-1 rounded-md border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="colorTexto" className="text-sm font-medium">Color de Texto</label>
              <div className="flex gap-2">
                <input
                  id="colorTexto"
                  name="colorTexto"
                  type="color"
                  value={colorTexto.startsWith("var") ? "#1a1a1a" : colorTexto}
                  onChange={(e) => setColorTexto(e.target.value)}
                  className="h-10 w-12 cursor-pointer rounded bg-transparent p-1"
                />
                <input
                  type="text"
                  value={colorTexto}
                  onChange={(e) => setColorTexto(e.target.value)}
                  className="flex-1 rounded-md border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-2 pt-2">
            <label className="text-sm font-medium">Imagen de Fondo (Opcional)</label>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={isUploading}
                className="rounded-md border border-input bg-transparent px-4 py-2 text-sm font-medium hover:bg-muted focus-visible:outline-none focus-visible:ring-1 disabled:opacity-50"
              >
                {isUploading ? "Subiendo..." : (imagenUrl ? "Cambiar Imagen" : "Subir Imagen")}
              </button>
              
              {imagenUrl && (
                <button
                  type="button"
                  onClick={() => setImagenUrl("")}
                  className="flex items-center gap-2 text-sm text-red-600 hover:text-red-800"
                >
                  <TrashIcon className="h-4 w-4" /> Quitar
                </button>
              )}
              
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={inputRef}
                onChange={handleFileChange}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-6">
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
            {isSubmitting ? "Guardando..." : "Guardar Banner"}
          </button>
        </div>
      </form>
      
      {/* Live Preview Container */}
      <div>
        <div className="sticky top-6 space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">Vista Previa en Vivo</h3>
          
          {/* This is the exact same structure as the PromoCarousel item */}
          <div
            className="relative flex min-h-32 flex-col items-center justify-center gap-1 overflow-hidden rounded-xl bg-cover bg-center px-6 py-8 text-center sm:min-h-36 shadow-lg border"
            style={{
              backgroundColor: colorFondo,
              backgroundImage: resolvedImageUrl ? `url(${resolvedImageUrl})` : undefined,
              color: colorTexto,
            }}
          >
            {resolvedImageUrl && (
              <div className="absolute inset-0 bg-black/40" aria-hidden="true" />
            )}
            <div className="relative z-10 flex flex-col items-center gap-1">
              {etiqueta && (
                <span
                  className="mb-1 rounded-full px-3 py-0.5 text-xs font-semibold uppercase tracking-wide ring-1"
                  style={{ borderColor: colorTexto }}
                >
                  {etiqueta}
                </span>
              )}
              <p className="font-heading text-xl font-bold sm:text-2xl">
                {titulo || "Título del Banner"}
              </p>
              {subtitulo && (
                <p className="text-sm opacity-90 sm:text-base">{subtitulo}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
