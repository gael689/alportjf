/**
 * Datos oficiales del comercio, centralizados en un único lugar.
 * Los campos marcados como pendientes se completan cuando el cliente los provea.
 */
export const SITE = {
  nombre: "ALPORT JF",
  nombreCompleto: "Alport JF — de Juan Carlos Freidenberger",
  eslogan: "Su mejor elección",
  rubro: "Artículos para el hogar y pinturería",
  direccion: "Av. San Martín 429, Puan, Buenos Aires",
  mapsQuery: "Av. San Martín 429, Puan, Buenos Aires, Argentina",
  desde: 2003,
  horarios: [
    { dias: "Lunes a Viernes", horario: "8:30 a 12:30 y 16:30 a 20:30 hs" },
    { dias: "Sábados", horario: "9:00 a 13:00 hs" },
  ],
  zonaEnvio: {
    sinCargo: "Envíos sin cargo en Puan y la zona",
    especiales: "Envíos especiales a coordinar con el comercio",
  },
  telefonoFijo: "2923 489176",
  // Pendiente de confirmación del cliente — placeholder editable en un solo lugar.
  whatsapp: "5492923581199",
  mail: "jfreidenberger@hotmail.com",
  instagram: "https://instagram.com/alportjfpuan",
  instagramHandle: "@alportjfpuan",
  facebook: "https://facebook.com/AlportJF",
  dominio: "alportjfpuan.com.ar",
} as const;

/** Años de trayectoria del local, calculados en base a SITE.desde. */
export function antiguedadAnios(): number {
  return new Date().getFullYear() - SITE.desde;
}

export const NAV_LINKS = [
  { href: "/productos", label: "Catálogo" },
  { href: "/promociones", label: "Promociones" },
  { href: "/sobre-alport", label: "Sobre Alport" },
  { href: "/contacto", label: "Contacto" },
] as const;
