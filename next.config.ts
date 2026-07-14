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
        // Las paginas (HTML) siempre se revalidan: evita que el navegador o el
        // operador movil muestren una version vieja del sitio a quien vuelve a
        // entrar. Se excluyen los assets versionados de Next (_next/*), que ya
        // Next.js cachea correctamente solo (no conviene tocarlos a mano).
        source: "/((?!_next/).*)",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
