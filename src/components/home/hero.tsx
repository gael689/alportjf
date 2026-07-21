import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { SITE, antiguedadAnios } from "@/lib/site-config";
import { whatsappConsultaGeneral } from "@/lib/whatsapp";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/local-fachada.jpg"
          alt="Local de Alport JF en Puan"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_60%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-deep/95 via-brand-deep/85 to-brand/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-deep/80 via-transparent to-transparent" />
      </div>

      <div className="mx-auto flex w-full max-w-7xl flex-col justify-center px-4 py-6 sm:py-8 lg:py-10">
        <div className="mb-2 flex flex-wrap gap-2">
          <span className="w-fit rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white ring-1 ring-white/30">
            Puan, Buenos Aires
          </span>
          <span className="w-fit rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white ring-1 ring-white/30">
            Desde {SITE.desde} · {antiguedadAnios()} años
          </span>
        </div>
        <h1 className="max-w-2xl font-heading text-4xl font-bold uppercase leading-tight text-white sm:text-5xl md:text-6xl">
          {SITE.nombre}
        </h1>
        <p className="mt-1 max-w-xl font-heading text-xl font-medium text-offer sm:text-2xl">
          {SITE.eslogan}
        </p>
        <p className="mt-2 max-w-lg text-base text-white/90 sm:text-lg">
          Electrodomésticos, climatización, pinturería, bazar, muebles y herramientas.
          Armá tu pedido online y coordinalo directo por WhatsApp.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button
            render={<Link href="/productos" />}
            nativeButton={false}
            size="lg"
            className="h-12 bg-white px-6 text-base text-brand hover:bg-white/90"
          >
            Ver catálogo
            <ArrowRightIcon className="size-4" />
          </Button>
          <Button
            render={
              <a
                href={whatsappConsultaGeneral()}
                target="_blank"
                rel="noopener noreferrer"
              />
            }
            nativeButton={false}
            size="lg"
            variant="outline"
            className="h-12 border-white/50 bg-white/10 px-6 text-base text-white hover:bg-white/20"
          >
            Comprar por WhatsApp
          </Button>
        </div>
      </div>
    </section>
  );
}
