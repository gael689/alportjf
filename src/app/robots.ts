import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `https://${SITE.dominio}/sitemap.xml`,
  };
}
