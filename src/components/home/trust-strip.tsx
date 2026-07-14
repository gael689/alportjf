import {
  TruckIcon,
  CreditCardIcon,
  SparklesIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import { SITE, antiguedadAnios } from "@/lib/site-config";

const ITEMS = [
  {
    icono: TruckIcon,
    titulo: "Envío sin cargo",
    detalle: SITE.zonaEnvio.sinCargo,
  },
  {
    icono: CreditCardIcon,
    titulo: "Medios de pago",
    detalle: "Efectivo, transferencia y tarjetas",
  },
  {
    icono: SparklesIcon,
    titulo: `${antiguedadAnios()} años de trayectoria`,
    detalle: `Acompañando a Puan desde ${SITE.desde}`,
  },
  {
    icono: MapPinIcon,
    titulo: "Local en Puan",
    detalle: SITE.direccion,
  },
];

export function TrustStrip() {
  return (
    <section className="border-y border-border bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-8 sm:grid-cols-2 lg:grid-cols-4">
        {ITEMS.map((item) => (
          <div key={item.titulo} className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-tint text-brand">
              <item.icono className="size-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-ink">{item.titulo}</p>
              <p className="text-sm text-muted-foreground">{item.detalle}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
