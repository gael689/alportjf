import type { Producto } from "@/data/types";
import { SITE } from "@/lib/site-config";

export function ProductJsonLd({ producto }: { producto: Producto }) {
  const precio = producto.precioPromo ?? producto.precio;
  // Google exige priceValidUntil para que el Offer sea elegible para rich results.
  // Si no hay oferta con vencimiento, se declara válido por un año desde ahora.
  const priceValidUntil =
    producto.ofertaHasta?.slice(0, 10) ??
    new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: producto.nombre,
    description: producto.descripcionLarga ?? producto.descripcion,
    brand: producto.marca ? { "@type": "Brand", name: producto.marca } : undefined,
    image: [`https://${SITE.dominio}${producto.imagen}`],
    // Google no acepta offers con price null: se omite el bloque si el producto no tiene precio.
    offers:
      precio === null
        ? undefined
        : {
            "@type": "Offer",
            priceCurrency: "ARS",
            price: precio,
            availability:
              producto.stock === 0
                ? "https://schema.org/OutOfStock"
                : "https://schema.org/InStock",
            url: `https://${SITE.dominio}/producto/${producto.slug}`,
            priceValidUntil,
          },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
