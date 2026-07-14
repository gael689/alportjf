import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import "../globals.css";
import { SITE } from "@/lib/site-config";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { WhatsAppFloatingButton } from "@/components/layout/whatsapp-floating-button";
import { FloatingCartButton } from "@/components/layout/floating-cart-button";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { LocalBusinessJsonLd } from "@/components/seo/local-business-jsonld";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const oswald = Oswald({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://alportjfpuan.com.ar"),
  title: {
    default: `${SITE.nombre} — ${SITE.eslogan} | Puan, Bs. As.`,
    template: `%s | ${SITE.nombre}`,
  },
  description:
    "Artículos para el hogar y pinturería en Puan. Electrodomésticos, climatización, TV, pinturería, bazar, muebles, colchones y herramientas. Hacé tu pedido y coordinalo por WhatsApp.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: SITE.nombre,
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es-AR"
      className={`${inter.variable} ${oswald.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink font-sans">
        <LocalBusinessJsonLd />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <WhatsAppFloatingButton />
        <FloatingCartButton />
        <CartDrawer />
        <Toaster />
      </body>
    </html>
  );
}
