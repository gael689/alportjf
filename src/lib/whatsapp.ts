import { SITE } from "@/lib/site-config";
import { formatPrice } from "@/lib/format";
import type { CartItem } from "@/store/cart-store";

function buildWhatsAppUrl(message: string): string {
  const phone = SITE.whatsapp.replace(/\D/g, "");
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function whatsappConsultaGeneral(): string {
  return buildWhatsAppUrl(`Hola ${SITE.nombre}! Quiero hacer una consulta.`);
}

export function whatsappConsultaProducto(nombreProducto: string, url?: string): string {
  const lineas = [
    `Hola ${SITE.nombre}! Quiero consultar por este producto:`,
    "",
    `• ${nombreProducto}`,
    url ? url : undefined,
    "",
    "¿Tienen stock disponible?",
  ].filter(Boolean);
  return buildWhatsAppUrl(lineas.join("\n"));
}

export function whatsappPedidoCarrito(items: CartItem[], total: number): string {
  const hayItemsSinPrecio = items.some(
    (item) => item.producto.precioPromo == null && item.producto.precio === null
  );

  const lineas = [
    `Hola ${SITE.nombre}! Quiero hacer este pedido:`,
    "",
    ...items.map((item) => {
      const precioUnitario = item.producto.precioPromo ?? item.producto.precio;
      const detalle =
        precioUnitario === null ? "a consultar" : formatPrice(precioUnitario * item.cantidad);
      return `• ${item.producto.nombre} x${item.cantidad} — ${detalle}`;
    }),
    "",
    `Total: ${formatPrice(total)}${hayItemsSinPrecio ? " (sin contar los productos a consultar)" : ""}`,
    "¿Tienen stock y coordinamos el envío?",
  ];
  return buildWhatsAppUrl(lineas.join("\n"));
}
