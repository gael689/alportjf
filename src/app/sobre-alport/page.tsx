import Image from "next/image";
import type { Metadata } from "next";
import {
  MapPinIcon,
  ClockIcon,
  PhoneIcon,
  TruckIcon,
  CreditCardIcon,
} from "@heroicons/react/24/outline";
import { SITE } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Sobre Alport",
  description:
    "Conocé Alport JF: artículos para el hogar y pinturería en Puan, Buenos Aires. Ubicación, horarios, zona de envío y medios de pago.",
};

export default function SobreAlportPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="font-heading text-3xl font-bold text-ink sm:text-4xl">
        Sobre {SITE.nombre}
      </h1>
      <p className="mt-3 max-w-3xl text-base leading-relaxed text-ink/80">
        {SITE.nombreCompleto} es un comercio de {SITE.rubro.toLowerCase()} ubicado
        en el corazón de Puan. Desde el local en {SITE.direccion} acompañamos a
        las familias de la zona con electrodomésticos, climatización, pinturería,
        bazar, muebles y herramientas — con atención cercana y de confianza.
      </p>

      <div className="mt-8 overflow-hidden rounded-xl border border-border">
        <Image
          src="/images/local-fachada.jpg"
          alt="Fachada del local de Alport JF en Puan"
          width={1200}
          height={800}
          className="h-64 w-full object-cover sm:h-80"
        />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div className="flex flex-col gap-4 rounded-xl border border-border bg-white p-6">
          <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-ink">
            <MapPinIcon className="size-5 text-brand" />
            Ubicación
          </h2>
          <p className="text-sm text-ink/80">{SITE.direccion}</p>
          <div className="overflow-hidden rounded-lg border border-border">
            <iframe
              title="Ubicación de Alport JF en Puan"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(
                SITE.mapsQuery
              )}&output=embed`}
              className="h-56 w-full"
              loading="lazy"
            />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-xl border border-border bg-white p-6">
            <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-ink">
              <ClockIcon className="size-5 text-brand" />
              Horarios de atención
            </h2>
            <ul className="mt-3 flex flex-col gap-1.5 text-sm text-ink/80">
              {SITE.horarios.map((h) => (
                <li key={h.dias}>
                  <span className="font-medium text-ink">{h.dias}:</span> {h.horario}
                </li>
              ))}
            </ul>
            <p className="mt-3 flex items-center gap-2 text-sm text-ink/80">
              <PhoneIcon className="size-4 text-brand" />
              {SITE.telefonoFijo}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-white p-6">
            <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-ink">
              <TruckIcon className="size-5 text-brand" />
              Zona de envío
            </h2>
            <p className="mt-2 text-sm text-ink/80">{SITE.zonaEnvio.sinCargo}.</p>
            <p className="mt-1 text-sm text-ink/80">{SITE.zonaEnvio.especiales}.</p>
          </div>

          <div className="rounded-xl border border-border bg-white p-6">
            <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-ink">
              <CreditCardIcon className="size-5 text-brand" />
              Medios de pago
            </h2>
            <p className="mt-2 text-sm text-ink/80">
              Efectivo, transferencia bancaria y tarjetas de crédito/débito. Consultá
              promociones bancarias vigentes en la sección{" "}
              <a href="/promociones" className="font-medium text-brand hover:underline">
                Promociones
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
