import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: "/admin",
      },
      // Permiso explícito para los crawlers de buscadores/asistentes de IA (GEO):
      // el catálogo es contenido público que buscamos que citen y recomienden.
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "OAI-SearchBot",
          "ClaudeBot",
          "Claude-Web",
          "anthropic-ai",
          "PerplexityBot",
          "Google-Extended",
          "Applebot-Extended",
        ],
        allow: "/",
        disallow: "/admin",
      },
    ],
    sitemap: `https://${SITE.dominio}/sitemap.xml`,
  };
}
