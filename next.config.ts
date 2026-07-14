import type { NextConfig } from "next";

const supabaseHostname = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: supabaseHostname
      ? [
          {
            protocol: "https",
            hostname: supabaseHostname,
            pathname: "/storage/v1/object/public/**",
          },
        ]
      : [],
  },
  async headers() {
    return [
      {
        // El panel de administración siempre se revalida: son pocas visitas (el
        // dueño del comercio) y necesitan ver el dato más nuevo siempre, así que
        // acá el costo de no cachear no importa.
        source: "/admin/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
        ],
      },
      // Las páginas públicas (home, catálogo, producto) ya NO llevan este header:
      // se sirven cacheadas (Vercel CDN + Next Data Cache) para aguantar muchas
      // visitas a la vez, y se invalidan al instante cuando el panel guarda un
      // cambio (revalidateTag/revalidatePath en cada server action de /admin).
    ];
  },
};

export default nextConfig;
