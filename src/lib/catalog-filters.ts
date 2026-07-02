import type { Producto } from "@/data/types";
import { getCategoriaBySlug } from "@/data/categorias";

export type CatalogSort = "relevancia" | "menor-precio" | "mayor-precio" | "nuevo" | "descuento";

export type CatalogFiltros = {
  /** slug de la categoría (ej. "electrodomesticos") */
  cat?: string;
  q?: string;
  min?: number;
  max?: number;
  sort?: CatalogSort;
  /** solo productos destacados */
  destacado?: boolean;
  /** solo productos nuevos */
  nuevo?: boolean;
};

export const PRECIO_MIN_DEFAULT = 0;
export const PRECIO_MAX_DEFAULT = 1_000_000;

export function filtrarYOrdenarProductos(
  productos: Producto[],
  { cat, q, min, max, sort, destacado, nuevo }: CatalogFiltros
): Producto[] {
  let resultado = [...productos];

  if (cat) {
    const categoria = getCategoriaBySlug(cat);
    resultado = resultado.filter((p) => p.categoriaId === categoria?.id);
  }

  if (destacado) {
    resultado = resultado.filter((p) => p.destacado);
  }

  if (nuevo) {
    resultado = resultado.filter((p) => p.nuevo);
  }

  if (q && q.trim()) {
    const termino = q.trim().toLowerCase();
    resultado = resultado.filter((p) =>
      [p.nombre, p.descripcion, p.marca ?? ""].some((campo) =>
        campo.toLowerCase().includes(termino)
      )
    );
  }

  if (typeof min === "number") {
    resultado = resultado.filter((p) => (p.precioPromo ?? p.precio) >= min);
  }

  if (typeof max === "number") {
    resultado = resultado.filter((p) => (p.precioPromo ?? p.precio) <= max);
  }

  switch (sort) {
    case "menor-precio":
      resultado.sort(
        (a, b) => (a.precioPromo ?? a.precio) - (b.precioPromo ?? b.precio)
      );
      break;
    case "mayor-precio":
      resultado.sort(
        (a, b) => (b.precioPromo ?? b.precio) - (a.precioPromo ?? a.precio)
      );
      break;
    case "nuevo":
      resultado.sort((a, b) => Number(b.nuevo) - Number(a.nuevo));
      break;
    case "descuento":
      resultado.sort((a, b) => {
        const descA = a.precioPromo ? 1 - a.precioPromo / a.precio : 0;
        const descB = b.precioPromo ? 1 - b.precioPromo / b.precio : 0;
        return descB - descA;
      });
      break;
    default:
      break;
  }

  return resultado;
}
