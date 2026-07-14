import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { SITE } from "@/lib/site-config";

export const OG_SIZE = { width: 1200, height: 630 };

/** Imagen de marca compartida por opengraph-image.tsx y twitter-image.tsx. */
export async function renderBrandOgImage() {
  const logoData = await readFile(
    join(process.cwd(), "public/images/alport-logo-white.png"),
    "base64"
  );
  const logoSrc = `data:image/png;base64,${logoData}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "28px",
          backgroundImage:
            "linear-gradient(135deg, #5C1F20 0%, #9A3334 55%, #7E2829 100%)",
          padding: "80px",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoSrc}
          width={460}
          height={200}
          style={{ objectFit: "contain" }}
        />
        <div
          style={{
            display: "flex",
            fontSize: "42px",
            fontWeight: 700,
            color: "#FFB800",
            letterSpacing: "1px",
          }}
        >
          {SITE.eslogan}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: "26px",
            color: "#ffffff",
            opacity: 0.92,
            textAlign: "center",
            maxWidth: "820px",
          }}
        >
          {SITE.rubro} en Puan, Buenos Aires
        </div>
        <div
          style={{
            display: "flex",
            marginTop: "8px",
            fontSize: "22px",
            color: "#ffffff",
            opacity: 0.75,
          }}
        >
          {SITE.dominio}
        </div>
      </div>
    ),
    { ...OG_SIZE }
  );
}
