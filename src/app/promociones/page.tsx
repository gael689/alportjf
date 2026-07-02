import type { Metadata } from "next";
import { BANNERS } from "@/data/banners";
import { SITE } from "@/lib/site-config";
import { whatsappConsultaGeneral } from "@/lib/whatsapp";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Promociones y descuentos bancarios",
  description:
    "Conocé las promociones bancarias, cuotas sin interés y descuentos vigentes en Alport JF, Puan.",
};

export default function PromocionesPage() {
  const activos = BANNERS.filter((b) => b.activo).sort((a, b) => a.orden - b.orden);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="font-heading text-3xl font-bold text-ink sm:text-4xl">
        Promociones y descuentos bancarios
      </h1>
      <p className="mt-2 max-w-2xl text-base text-muted-foreground">
        Estas son las promociones vigentes en {SITE.nombre}. Se actualizan
        constantemente, así que volvé a mirar seguido o consultanos por WhatsApp
        para conocer la última novedad.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {activos.map((banner) => (
          <div
            key={banner.id}
            className="flex flex-col justify-center gap-2 rounded-xl px-6 py-10 text-center"
            style={{ backgroundColor: banner.colorFondo, color: banner.colorTexto }}
          >
            {banner.etiqueta && (
              <span
                className="mx-auto mb-1 w-fit rounded-full px-3 py-0.5 text-xs font-semibold uppercase tracking-wide ring-1"
                style={{ borderColor: banner.colorTexto }}
              >
                {banner.etiqueta}
              </span>
            )}
            <p className="font-heading text-2xl font-bold">{banner.titulo}</p>
            {banner.subtitulo && <p className="text-base opacity-90">{banner.subtitulo}</p>}
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-xl border border-border bg-white p-6 text-center">
        <p className="text-base font-medium text-ink">
          ¿Tenés dudas sobre alguna promoción o financiación?
        </p>
        <Button
          render={
            <a href={whatsappConsultaGeneral()} target="_blank" rel="noopener noreferrer" />
          }
          nativeButton={false}
          size="lg"
          className="mt-4 bg-success text-white hover:bg-success/90"
        >
          Consultar por WhatsApp
        </Button>
      </div>
    </div>
  );
}
