import type { PromoBanner } from "@/data/types";

/** Catálogo de ejemplo, usado mientras Supabase no está configurado (ver supabase/README.md). */
export const BANNERS_SEED: PromoBanner[] = [
  {
    id: "banner-1",
    titulo: "¡Hasta 12 cuotas sin interés!",
    subtitulo: "Con tarjetas de crédito seleccionadas. Aprovechá antes de que termine el mes",
    etiqueta: "🔥 Bancarias",
    colorFondo: "var(--red-brand)",
    colorTexto: "#FFFFFF",
    orden: 1,
    activo: true,
  },
  {
    id: "banner-2",
    titulo: "15% OFF pagando por transferencia",
    subtitulo: "Válido en toda la tienda, todos los días. El descuento se aplica al instante",
    etiqueta: "💸 Transferencia",
    colorFondo: "var(--ink)",
    colorTexto: "#FFFFFF",
    orden: 2,
    activo: true,
  },
  {
    id: "banner-3",
    titulo: "¿Necesitás financiar tu compra?",
    subtitulo: "Créditos personales disponibles. Consultá condiciones en el local o por WhatsApp",
    etiqueta: "🤝 Financiación",
    colorFondo: "var(--red-dark)",
    colorTexto: "#FFFFFF",
    orden: 3,
    activo: true,
  },
  {
    id: "banner-4",
    titulo: "3 cuotas sin interés con todas las tarjetas",
    subtitulo: "En electrodomésticos seleccionados. Stock limitado, ¡no te quedes afuera!",
    etiqueta: "⚡ Cuotas",
    colorFondo: "var(--offer)",
    colorTexto: "var(--ink)",
    orden: 4,
    activo: true,
  },
];
