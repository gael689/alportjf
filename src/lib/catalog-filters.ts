import type { Producto } from "@/data/types";

export type CatalogSort = "relevancia" | "menor-precio" | "mayor-precio" | "nuevo" | "descuento";

export type CatalogFiltros = {
  /** id de la categoría ya resuelto (el caller busca el slug -> categoría antes de filtrar) */
  categoriaId?: string;
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
  { categoriaId, q, min, max, sort, destacado, nuevo }: CatalogFiltros
): Producto[] {
  let resultado = [...productos];

  if (categoriaId) {
    resultado = resultado.filter((p) => p.categoriaId === categoriaId);
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
    resultado = resultado.filter((p) => {
      const precio = p.precioPromo ?? p.precio;
      return precio === null || precio >= min;
    });
  }

  if (typeof max === "number") {
    resultado = resultado.filter((p) => {
      const precio = p.precioPromo ?? p.precio;
      return precio === null || precio <= max;
    });
  }

  // Los productos sin precio ("consultar") quedan siempre al final al ordenar por precio.
  switch (sort) {
    case "menor-precio":
      resultado.sort((a, b) => {
        const precioA = a.precioPromo ?? a.precio;
        const precioB = b.precioPromo ?? b.precio;
        if (precioA === null) return precioB === null ? 0 : 1;
        if (precioB === null) return -1;
        return precioA - precioB;
      });
      break;
    case "mayor-precio":
      resultado.sort((a, b) => {
        const precioA = a.precioPromo ?? a.precio;
        const precioB = b.precioPromo ?? b.precio;
        if (precioA === null) return precioB === null ? 0 : 1;
        if (precioB === null) return -1;
        return precioB - precioA;
      });
      break;
    case "nuevo":
      resultado.sort((a, b) => Number(b.nuevo) - Number(a.nuevo));
      break;
    case "descuento":
      resultado.sort((a, b) => {
        const descA = a.precioPromo && a.precio ? 1 - a.precioPromo / a.precio : 0;
        const descB = b.precioPromo && b.precio ? 1 - b.precioPromo / b.precio : 0;
        return descB - descA;
      });
      break;
    default:
      break;
  }

  return resultado;
}
