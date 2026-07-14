import type { Categoria } from "@/data/types";

/** Catálogo de ejemplo, usado mientras Supabase no está configurado (ver supabase/README.md). */
export const CATEGORIAS_SEED: Categoria[] = [
  { id: "cat-1", slug: "electrodomesticos", nombre: "Electrodomésticos", icono: "BoltIcon", destacada: true, activo: true },
  { id: "cat-2", slug: "climatizacion", nombre: "Climatización", icono: "CloudIcon", destacada: true, activo: true },
  { id: "cat-3", slug: "tv-tecnologia", nombre: "Televisores y Tecnología", icono: "TvIcon", destacada: true, activo: true },
  { id: "cat-4", slug: "pintureria", nombre: "Pinturería", icono: "PaintBrushIcon", destacada: true, activo: true },
  { id: "cat-5", slug: "bazar-hogar", nombre: "Bazar y Hogar", icono: "HomeIcon", destacada: false, activo: true },
  { id: "cat-6", slug: "muebles-jardin", nombre: "Muebles y Jardín", icono: "SunIcon", destacada: false, activo: true },
  { id: "cat-7", slug: "colchones-blanqueria", nombre: "Colchones y Blanquería", icono: "MoonIcon", destacada: false, activo: true },
  { id: "cat-8", slug: "herramientas", nombre: "Herramientas", icono: "WrenchScrewdriverIcon", destacada: false, activo: true },
];
