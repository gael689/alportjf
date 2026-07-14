"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { TrashIcon, ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/outline";

export type ImageItem = {
  url: string;
  isNew?: boolean;
};

type ImageUploaderProps = {
  imagenes: ImageItem[];
  onChange: (imagenes: ImageItem[]) => void;
};

export function ImageUploader({ imagenes, onChange }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const supabase = createClient();
    const newImagenes = [...imagenes];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data, error } = await supabase.storage
        .from("productos")
        .upload(filePath, file);

      if (error) {
        console.error("Error uploading image:", error);
        alert(`Error al subir la imagen ${file.name}`);
      } else if (data) {
        newImagenes.push({ url: data.path, isNew: true });
      }
    }

    onChange(newImagenes);
    setIsUploading(false);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleRemove = (index: number) => {
    // Optionally delete from Supabase storage immediately here or let a cron job clean it up.
    // For simplicity, we just remove from the list.
    const newImagenes = [...imagenes];
    newImagenes.splice(index, 1);
    onChange(newImagenes);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newImagenes = [...imagenes];
    const temp = newImagenes[index - 1];
    newImagenes[index - 1] = newImagenes[index];
    newImagenes[index] = temp;
    onChange(newImagenes);
  };

  const handleMoveDown = (index: number) => {
    if (index === imagenes.length - 1) return;
    const newImagenes = [...imagenes];
    const temp = newImagenes[index + 1];
    newImagenes[index + 1] = newImagenes[index];
    newImagenes[index] = temp;
    onChange(newImagenes);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {imagenes.map((img, index) => {
          // Si es una URL completa (ej. de datos semilla), la usamos directo
          // Si es un path de Supabase, obtenemos la URL pública
          const supabase = createClient();
          const src = img.url.startsWith("http") || img.url.startsWith("/")
            ? img.url
            : supabase.storage.from("productos").getPublicUrl(img.url).data.publicUrl;

          return (
            <div key={img.url} className="relative group aspect-square rounded-md border bg-muted overflow-hidden">
              <img
                src={src}
                alt={`Preview ${index}`}
                className="w-full h-full object-cover"
              />
              {index === 0 && (
                <div className="absolute top-2 left-2 bg-brand text-white text-xs font-bold px-2 py-1 rounded shadow">
                  Principal
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => handleMoveUp(index)}
                  disabled={index === 0}
                  className="bg-white p-1 rounded hover:bg-gray-200 disabled:opacity-50"
                  title="Mover principal/arriba"
                >
                  <ArrowUpIcon className="w-4 h-4 text-black" />
                </button>
                <button
                  type="button"
                  onClick={() => handleMoveDown(index)}
                  disabled={index === imagenes.length - 1}
                  className="bg-white p-1 rounded hover:bg-gray-200 disabled:opacity-50"
                  title="Mover abajo"
                >
                  <ArrowDownIcon className="w-4 h-4 text-black" />
                </button>
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="bg-red-500 p-1 rounded hover:bg-red-600 text-white"
                  title="Eliminar"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}

        <div
          className="aspect-square rounded-md border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:bg-muted/50 transition-colors cursor-pointer"
          onClick={() => inputRef.current?.click()}
        >
          {isUploading ? (
            <div className="text-sm font-medium">Subiendo...</div>
          ) : (
            <>
              <div className="text-2xl">+</div>
              <div className="text-xs text-center px-2">Agregar imagen</div>
            </>
          )}
        </div>
      </div>

      <input
        type="file"
        accept="image/*"
        capture="environment"
        multiple
        className="hidden"
        ref={inputRef}
        onChange={handleFileChange}
        disabled={isUploading}
      />
    </div>
  );
}
