import { renderBrandOgImage, OG_SIZE } from "@/lib/og-image";
import { SITE } from "@/lib/site-config";

export const alt = `${SITE.nombre} — ${SITE.eslogan}`;
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return renderBrandOgImage();
}
