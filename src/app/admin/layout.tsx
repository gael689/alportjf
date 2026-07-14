import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import "../globals.css";

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
  title: {
    default: "Panel de administración | Alport JF",
    template: "%s | Panel Alport JF",
  },
  robots: { index: false, follow: false },
};

// Root layout independiente del sitio público (ver app/(site)/layout.tsx):
// el panel no debe mostrar el header/footer/WhatsApp/carrito de la tienda.
export default function AdminRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-AR" className={`${inter.variable} ${oswald.variable} h-full antialiased`}>
      <body className="min-h-full bg-paper text-ink font-sans">{children}</body>
    </html>
  );
}
