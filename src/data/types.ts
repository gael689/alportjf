export type Categoria = {
  id: string;
  slug: string;
  nombre: string;
  /** Nombre del ícono de Heroicons (24/outline), resuelto en lib/category-icons.tsx */
  icono: string;
  /** Se muestra en la grilla de categorías destacadas de la home */
  destacada: boolean;
  activo: boolean;
};

export type Producto = {
  id: string;
  slug: string;
  nombre: string;
  marca?: string;
  descripcion: string;
  descripcionLarga?: string;
  categoriaId: string;
  imagen: string;
  /** Precio normal en ARS. null = "sin precio", se muestra "Consultar precio" */
  precio: number | null;
  /** Precio promocional en ARS, si aplica */
  precioPromo?: number;
  /** Fecha ISO de vencimiento de la oferta, activa el contador */
  ofertaHasta?: string;
  destacado: boolean;
  nuevo: boolean;
  stock?: number;
};

export type PromoBanner = {
  id: string;
  /** Imagen de fondo opcional, subida desde el panel (si no hay, se usa colorFondo/colorTexto) */
  imagenUrl?: string;
  titulo: string;
  subtitulo?: string;
  etiqueta?: string;
  colorFondo: string;
  colorTexto: string;
  orden: number;
  activo: boolean;
};
