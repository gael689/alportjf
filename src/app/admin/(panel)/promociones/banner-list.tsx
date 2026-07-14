"use client";

import { useState } from "react";
import Link from "next/link";
import { toggleBannerStatus, deleteBanner, reorderBanners } from "./actions";
import { TrashIcon, PencilIcon, ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/outline";
import { createClient } from "@/lib/supabase/client";

export type BannerListItem = {
  id: string;
  titulo: string;
  etiqueta: string;
  color_fondo: string;
  color_texto: string;
  imagen_path: string | null;
  activo: boolean;
  orden: number;
};

export function BannerList({ initialBanners }: { initialBanners: BannerListItem[] }) {
  const [banners, setBanners] = useState(initialBanners);
  const [isReordering, setIsReordering] = useState(false);
  const supabase = createClient();

  const handleToggle = async (id: string, field: "activo", currentValue: boolean) => {
    setBanners((prev) => 
      prev.map((b) => b.id === id ? { ...b, [field]: !currentValue } : b)
    );
    const result = await toggleBannerStatus(id, field, !currentValue);
    if (!result.success) {
      setBanners((prev) => 
        prev.map((b) => b.id === id ? { ...b, [field]: currentValue } : b)
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este banner?")) {
      const result = await deleteBanner(id);
      if (result.success) {
        setBanners((prev) => prev.filter((b) => b.id !== id));
      } else {
        alert("No se pudo eliminar. " + (result.error || ""));
      }
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === banners.length - 1) return;

    setIsReordering(true);
    
    const newBanners = [...banners];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    
    const temp = newBanners[index];
    newBanners[index] = newBanners[swapIndex];
    newBanners[swapIndex] = temp;
    
    setBanners(newBanners);
    
    const orderedIds = newBanners.map(b => b.id);
    await reorderBanners(orderedIds);
    
    setIsReordering(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Link
          href="/admin/promociones/nuevo"
          className="inline-flex h-9 items-center justify-center rounded-md bg-brand px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          Nuevo Banner
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {banners.map((banner, index) => {
          let resolvedImageUrl = banner.imagen_path;
          if (resolvedImageUrl && !resolvedImageUrl.startsWith("http") && !resolvedImageUrl.startsWith("/")) {
            resolvedImageUrl = supabase.storage.from("banners").getPublicUrl(resolvedImageUrl).data.publicUrl;
          }

          return (
            <div key={banner.id} className="flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm">
              <div
                className="relative flex h-32 flex-col items-center justify-center gap-1 bg-cover bg-center px-4 text-center"
                style={{
                  backgroundColor: banner.color_fondo,
                  backgroundImage: resolvedImageUrl ? `url(${resolvedImageUrl})` : undefined,
                  color: banner.color_texto,
                }}
              >
                {resolvedImageUrl && (
                  <div className="absolute inset-0 bg-black/40" aria-hidden="true" />
                )}
                <div className="relative z-10">
                  {banner.etiqueta && (
                    <span
                      className="mb-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1"
                      style={{ borderColor: banner.color_texto }}
                    >
                      {banner.etiqueta}
                    </span>
                  )}
                  <p className="font-heading text-lg font-bold leading-tight">
                    {banner.titulo}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between border-t bg-muted/30 p-3">
                <div className="flex items-center gap-2">
                  <div className="flex bg-muted rounded border overflow-hidden">
                    <button 
                      onClick={() => handleMove(index, "up")} 
                      disabled={index === 0 || isReordering}
                      className="p-1.5 text-muted-foreground hover:text-ink hover:bg-gray-200 disabled:opacity-30 disabled:hover:bg-transparent"
                    >
                      <ArrowUpIcon className="w-4 h-4" />
                    </button>
                    <div className="w-px bg-border" />
                    <button 
                      onClick={() => handleMove(index, "down")} 
                      disabled={index === banners.length - 1 || isReordering}
                      className="p-1.5 text-muted-foreground hover:text-ink hover:bg-gray-200 disabled:opacity-30 disabled:hover:bg-transparent"
                    >
                      <ArrowDownIcon className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-1.5 ml-2">
                    <input
                      type="checkbox"
                      id={`activo-${banner.id}`}
                      checked={banner.activo}
                      onChange={() => handleToggle(banner.id, "activo", banner.activo)}
                      className="cursor-pointer"
                    />
                    <label htmlFor={`activo-${banner.id}`} className="text-xs font-medium cursor-pointer">
                      Activo
                    </label>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <Link
                    href={`/admin/promociones/${banner.id}`}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md border bg-white hover:bg-muted"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(banner.id)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {banners.length === 0 && (
        <div className="rounded-xl border border-dashed p-12 text-center">
          <p className="text-muted-foreground">No hay banners promocionales configurados.</p>
        </div>
      )}
    </div>
  );
}
