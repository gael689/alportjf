"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState } from "react";
import { CATEGORIAS } from "@/data/categorias";
import { formatPrice } from "@/lib/format";
import { PRECIO_MAX_DEFAULT, PRECIO_MIN_DEFAULT } from "@/lib/catalog-filters";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { XMarkIcon } from "@heroicons/react/24/outline";

const ORDEN_OPCIONES = [
  { value: "relevancia", label: "Relevancia" },
  { value: "menor-precio", label: "Menor precio" },
  { value: "mayor-precio", label: "Mayor precio" },
  { value: "nuevo", label: "Novedades" },
  { value: "descuento", label: "Mayor descuento" },
];

export function ProductFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const catActual = searchParams.get("cat") ?? "";
  const sortActual = searchParams.get("sort") ?? "relevancia";
  const minActual = Number(searchParams.get("min") ?? PRECIO_MIN_DEFAULT);
  const maxActual = Number(searchParams.get("max") ?? PRECIO_MAX_DEFAULT);

  const [rango, setRango] = useState([minActual, maxActual]);

  function updateParams(updates: Record<string, string | null | undefined>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value === undefined || value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  const hayFiltrosActivos =
    catActual || sortActual !== "relevancia" || minActual > PRECIO_MIN_DEFAULT || maxActual < PRECIO_MAX_DEFAULT;

  return (
    <div className="flex flex-col gap-6 rounded-xl border border-border bg-white p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-base font-semibold text-ink">Filtros</h2>
        {hayFiltrosActivos && (
          <button
            type="button"
            onClick={() => router.push(pathname)}
            className="flex items-center gap-1 text-xs font-medium text-brand hover:underline"
          >
            <XMarkIcon className="size-3.5" />
            Limpiar
          </button>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-ink">Categoría</label>
        <Select
          value={catActual || "todas"}
          onValueChange={(value) =>
            updateParams({ cat: value === "todas" ? undefined : value })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Todas las categorías" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas las categorías</SelectItem>
            {CATEGORIAS.map((cat) => (
              <SelectItem key={cat.id} value={cat.slug}>
                {cat.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-sm font-medium text-ink">Precio</label>
        <Slider
          min={PRECIO_MIN_DEFAULT}
          max={PRECIO_MAX_DEFAULT}
          step={5000}
          value={rango}
          onValueChange={(value) => setRango(value as number[])}
          onValueCommitted={(value) => {
            const [min, max] = value as number[];
            updateParams({
              min: min > PRECIO_MIN_DEFAULT ? String(min) : undefined,
              max: max < PRECIO_MAX_DEFAULT ? String(max) : undefined,
            });
          }}
        />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{formatPrice(rango[0])}</span>
          <span>{formatPrice(rango[1])}</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-ink">Ordenar por</label>
        <Select
          value={sortActual}
          onValueChange={(value) => updateParams({ sort: value })}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ORDEN_OPCIONES.map((op) => (
              <SelectItem key={op.value} value={op.value}>
                {op.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
