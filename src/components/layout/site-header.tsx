import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import {
  PhoneIcon,
  ClockIcon,
  StarIcon,
  SparklesIcon,
  TagIcon,
} from "@heroicons/react/24/outline";
import { SITE, NAV_LINKS } from "@/lib/site-config";
import { getAllCategorias } from "@/data/categorias";
import { CategoryIcon } from "@/lib/category-icons";
import { SearchBar } from "@/components/layout/search-bar";
import { CartButton } from "@/components/layout/cart-button";
import { MobileNav } from "@/components/layout/mobile-nav";

const ACCESOS_ESPECIALES = [
  { href: "/productos?destacado=1", label: "Destacados", icono: StarIcon },
  { href: "/productos?nuevo=1", label: "Lo nuevo", icono: SparklesIcon },
  { href: "/promociones", label: "Promociones", icono: TagIcon },
];

export async function SiteHeader() {
  const categorias = await getAllCategorias();

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-white">
      {/* Top bar de confianza */}
      <div className="hidden bg-brand text-white sm:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5 text-xs">
          <span className="font-medium">
            🚚 {SITE.zonaEnvio.sinCargo}
          </span>
          <div className="flex items-center gap-4 text-white/90">
            <span className="inline-flex items-center gap-1">
              <ClockIcon className="size-3.5" />
              Lun a Vie 8:30–12:30 y 16:30–20:30 hs
            </span>
            <span className="inline-flex items-center gap-1">
              <PhoneIcon className="size-3.5" />
              {SITE.telefonoFijo}
            </span>
          </div>
        </div>
      </div>

      {/* Header principal */}
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
        <MobileNav categorias={categorias} />

        <Link href="/" className="shrink-0">
          <Image
            src="/images/alport-logo-light.png"
            alt={SITE.nombre}
            width={160}
            height={57}
            priority
            className="h-10 w-auto sm:h-12"
          />
        </Link>

        <div className="hidden flex-1 md:block">
          <Suspense fallback={<div className="h-10" />}>
            <SearchBar className="max-w-xl" />
          </Suspense>
        </div>

        {/* Empuja el carrito al extremo derecho en mobile, donde el buscador no ocupa espacio */}
        <div className="flex-1 md:hidden" />

        <nav className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink hover:text-brand"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <CartButton />
      </div>

      {/* Buscador mobile */}
      <div className="border-t border-border px-4 py-2 md:hidden">
        <Suspense fallback={<div className="h-10" />}>
          <SearchBar />
        </Suspense>
      </div>

      {/* Barra de categorías */}
      <div className="border-t border-border bg-paper">
        <div className="mx-auto flex max-w-7xl items-center gap-1.5 overflow-x-auto px-4 py-2 [scrollbar-width:none]">
          {ACCESOS_ESPECIALES.map((acceso) => (
            <Link
              key={acceso.href}
              href={acceso.href}
              className="flex shrink-0 items-center gap-1.5 rounded-full bg-brand px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-dark"
            >
              <acceso.icono className="size-4" />
              {acceso.label}
            </Link>
          ))}

          <span className="mx-1 h-5 w-px shrink-0 bg-border" aria-hidden="true" />

          {categorias.map((cat) => (
            <Link
              key={cat.id}
              href={`/productos?cat=${cat.slug}`}
              className="flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-ink/80 hover:bg-brand-tint hover:text-brand"
            >
              <CategoryIcon icono={cat.icono} className="size-4" />
              {cat.nombre}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
