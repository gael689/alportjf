import type { Producto } from "@/data/types";
import { SITE } from "@/lib/site-config";

export function ProductJsonLd({ producto }: { producto: Producto }) {
  const precio = producto.precioPromo ?? producto.precio;

  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: producto.nombre,
    description: producto.descripcionLarga ?? producto.descripcion,
    brand: producto.marca ? { "@type": "Brand", name: producto.marca } : undefined,
    image: [`https://${SITE.dominio}${producto.imagen}`],
    offers: {
      "@type": "Offer",
      priceCurrency: "ARS",
      price: precio,
      availability:
        producto.stock === 0
          ? "https://schema.org/OutOfStock"
          : "https://schema.org/InStock",
      url: `https://${SITE.dominio}/producto/${producto.slug}`,
      priceValidUntil: producto.ofertaHasta?.slice(0, 10),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
