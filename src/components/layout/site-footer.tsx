import Link from "next/link";
import Image from "next/image";
import {
  MapPinIcon,
  ClockIcon,
  PhoneIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";
import { SITE, NAV_LINKS } from "@/lib/site-config";
import { getAllCategorias } from "@/data/categorias";

export async function SiteFooter() {
  const categorias = await getAllCategorias();

  return (
    <footer className="overflow-x-hidden bg-ink text-white/80">
      <div className="mx-auto grid max-w-7xl lg:grid-cols-4">
        <div className="relative isolate flex flex-col gap-3 bg-brand px-4 py-10 lg:col-span-1 lg:bg-transparent">
          {/* El fondo se ata al borde derecho de esta misma columna (siempre coincide con el
              texto) y se extiende hacia la izquierda hasta el borde real de la pantalla en lg+. */}
          <div
            aria-hidden
            className="absolute inset-y-0 right-0 -z-10 hidden bg-brand lg:block"
            style={{ left: "calc(50% - 50vw)" }}
          />
          <Image
            src="/images/alport-logo-red-crop.png"
            alt={SITE.nombre}
            width={836}
            height={363}
            className="h-24 w-auto self-start"
          />
          <p className="text-sm">{SITE.rubro}</p>
          <p className="text-sm text-white/75">{SITE.nombreCompleto}</p>
        </div>

        <div className="grid gap-10 px-4 py-10 sm:grid-cols-2 lg:col-span-3 lg:grid-cols-3">
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
              {categorias.slice(0, 6).map((cat) => (
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
      </div>

      <div className="flex flex-col items-center justify-center gap-2 border-t border-white/10 px-4 py-4 text-center text-xs text-white/50 sm:flex-row sm:gap-3">
        <span>
          © {new Date().getFullYear()} {SITE.nombre} — {SITE.eslogan}. Puan,
          Buenos Aires.
        </span>
        <a
          href="https://gaelgonzalez.com.ar"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 rounded-full border border-white/20 px-3 py-1 text-white/70 transition-colors hover:border-white/40 hover:bg-white/10 hover:text-white"
        >
          Desarrollado por <span className="font-semibold">Gael González</span>
        </a>
      </div>
    </footer>
  );
}
