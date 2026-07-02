import type { Categoria } from "@/data/types";

export const CATEGORIAS: Categoria[] = [
  { id: "cat-1", slug: "electrodomesticos", nombre: "Electrodomésticos", icono: "BoltIcon" },
  { id: "cat-2", slug: "climatizacion", nombre: "Climatización", icono: "CloudIcon" },
  { id: "cat-3", slug: "tv-tecnologia", nombre: "Televisores y Tecnología", icono: "TvIcon" },
  { id: "cat-4", slug: "pintureria", nombre: "Pinturería", icono: "PaintBrushIcon" },
  { id: "cat-5", slug: "bazar-hogar", nombre: "Bazar y Hogar", icono: "HomeIcon" },
  { id: "cat-6", slug: "muebles-jardin", nombre: "Muebles y Jardín", icono: "SunIcon" },
  { id: "cat-7", slug: "colchones-blanqueria", nombre: "Colchones y Blanquería", icono: "MoonIcon" },
  { id: "cat-8", slug: "herramientas", nombre: "Herramientas", icono: "WrenchScrewdriverIcon" },
];

export function getCategoriaBySlug(slug: string): Categoria | undefined {
  return CATEGORIAS.find((c) => c.slug === slug);
}

export function getCategoriaById(id: string): Categoria | undefined {
  return CATEGORIAS.find((c) => c.id === id);
}
