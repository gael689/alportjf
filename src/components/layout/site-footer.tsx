import Link from "next/link";
import Image from "next/image";
import {
  MapPinIcon,
  ClockIcon,
  PhoneIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";
import { SITE, NAV_LINKS } from "@/lib/site-config";
import { CATEGORIAS } from "@/data/categorias";

export function SiteFooter() {
  return (
    <footer className="bg-ink text-white/80">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-3">
          <Image
            src="/images/alport-logo-light.png"
            alt={SITE.nombre}
            width={160}
            height={57}
            className="h-10 w-auto brightness-0 invert"
          />
          <p className="text-sm">{SITE.rubro}</p>
          <p className="text-sm text-white/60">{SITE.nombreCompleto}</p>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-white">
            Contacto
          </h3>
          <p className="flex items-start gap-2 text-sm">
            <MapPinIcon className="mt-0.5 size-4 shrink-0" />
            {SITE.direccion}
          </p>
          <p className="flex items-center gap-2 text-sm">
            <PhoneIcon className="size-4 shrink-0" />
            {SITE.telefonoFijo}
          </p>
          <p className="flex items-center gap-2 text-sm">
            <EnvelopeIcon className="size-4 shrink-0" />
            {SITE.mail}
          </p>
          <div className="flex flex-col gap-1 pt-1">
            {SITE.horarios.map((h) => (
              <p key={h.dias} className="flex items-start gap-2 text-sm">
                <ClockIcon className="mt-0.5 size-4 shrink-0" />
                <span>
                  {h.dias}: {h.horario}
                </span>
              </p>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-white">
            Categorías
          </h3>
          <ul className="flex flex-col gap-2 text-sm">
            {CATEGORIAS.slice(0, 6).map((cat) => (
              <li key={cat.id}>
                <Link
                  href={`/productos?cat=${cat.slug}`}
                  className="hover:text-white"
                >
                  {cat.nombre}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-2 pt-2 text-sm">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-white">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-white">
            Encontranos
          </h3>
          <div className="overflow-hidden rounded-lg border border-white/10">
            <iframe
              title="Ubicación de Alport JF en Puan"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(
                SITE.mapsQuery
              )}&output=embed`}
              className="h-40 w-full grayscale"
              loading="lazy"
            />
          </div>
          <div className="flex gap-3 pt-1">
            <a
              href={SITE.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm hover:text-white"
            >
              Instagram
            </a>
            <a
              href={SITE.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm hover:text-white"
            >
              Facebook
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-white/50">
        © {new Date().getFullYear()} {SITE.nombre} — {SITE.eslogan}. Puan, Buenos
        Aires.
      </div>
    </footer>
  );
}
