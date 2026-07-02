import type { MetadataRoute } from "next";
import { PRODUCTOS } from "@/data/productos";
import { SITE } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = `https://${SITE.dominio}`;
  const now = new Date();

  const rutasEstaticas: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/productos`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/promociones`, lastModified: now, changeFrequency: "daily", priority: 0.7 },
    { url: `${base}/sobre-alport`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/contacto`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  const rutasProductos: MetadataRoute.Sitemap = PRODUCTOS.map((p) => ({
    url: `${base}/producto/${p.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...rutasEstaticas, ...rutasProductos];
}
