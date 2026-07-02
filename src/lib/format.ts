const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

export function formatPrice(value: number): string {
  return currencyFormatter.format(value);
}

/** % de descuento redondeado entre precio normal y precio promocional. */
export function calcularDescuento(precio: number, precioPromo: number): number {
  if (precio <= 0 || precioPromo >= precio) return 0;
  return Math.round((1 - precioPromo / precio) * 100);
}
