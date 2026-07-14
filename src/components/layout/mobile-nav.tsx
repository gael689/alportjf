"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Bars3Icon, StarIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { SITE, NAV_LINKS } from "@/lib/site-config";
import type { Categoria } from "@/data/types";
import { CategoryIcon } from "@/lib/category-icons";
import { whatsappConsultaGeneral } from "@/lib/whatsapp";

const ACCESOS_ESPECIALES = [
  { href: "/productos?destacado=1", label: "Destacados", icono: StarIcon },
  { href: "/productos?nuevo=1", label: "Lo nuevo", icono: SparklesIcon },
];

export function MobileNav({ categorias }: { categorias: Categoria[] }) {
  return (
    <Sheet>
      <SheetTrigger
        aria-label="Abrir menú"
        className="flex size-10 items-center justify-center rounded-full text-ink hover:bg-brand-tint lg:hidden"
      >
        <Bars3Icon className="size-6" />
      </SheetTrigger>
      <SheetContent side="left" className="flex w-72 flex-col sm:!max-w-xs">
        <SheetHeader className="border-b border-border">
          <SheetTitle className="sr-only">Menú</SheetTitle>
          <Image
            src="/images/alport-logo-light.png"
            alt={SITE.nombre}
            width={140}
            height={50}
            className="h-9 w-auto"
          />
        </SheetHeader>

        <div className="flex gap-2 px-3 pt-3">
          {ACCESOS_ESPECIALES.map((acceso) => (
            <Link
              key={acceso.href}
              href={acceso.href}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-brand px-3 py-2 text-xs font-semibold text-white hover:bg-brand-dark"
            >
              <acceso.icono className="size-4" />
              {acceso.label}
            </Link>
          ))}
        </div>

        <nav className="flex flex-col gap-1 px-2 py-3">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2.5 text-base font-medium text-ink hover:bg-brand-tint hover:text-brand"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-border px-2 py-3">
          <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Categorías
          </p>
          <div className="flex flex-col gap-1">
            {categorias.map((cat) => (
              <Link
                key={cat.id}
                href={`/productos?cat=${cat.slug}`}
                className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-ink/80 hover:bg-brand-tint hover:text-brand"
              >
                <CategoryIcon icono={cat.icono} className="size-4" />
                {cat.nombre}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-auto border-t border-border p-4">
          <a
            href={whatsappConsultaGeneral()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-11 w-full items-center justify-center rounded-lg bg-success text-sm font-semibold text-white"
          >
            Consultar por WhatsApp
          </a>
        </div>
      </SheetContent>
    </Sheet>
  );
}
