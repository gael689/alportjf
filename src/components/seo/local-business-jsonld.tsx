import { SITE } from "@/lib/site-config";

export function LocalBusinessJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "HardwareStore",
    name: SITE.nombre,
    alternateName: SITE.nombreCompleto,
    description:
      "Artículos para el hogar y pinturería en Puan, Buenos Aires: electrodomésticos, climatización, TV, pinturería, bazar, muebles, colchones y herramientas.",
    url: `https://${SITE.dominio}`,
    telephone: SITE.telefonoFijo,
    email: SITE.mail,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Av. San Martín 429",
      addressLocality: "Puan",
      addressRegion: "Buenos Aires",
      addressCountry: "AR",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
        ],
        opens: "08:30",
        closes: "12:30",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
        ],
        opens: "16:30",
        closes: "20:30",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "09:00",
        closes: "13:00",
      },
    ],
    sameAs: [SITE.instagram, SITE.facebook],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
