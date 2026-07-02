"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { PromoBanner } from "@/data/types";

export function PromoCarousel({ banners }: { banners: PromoBanner[] }) {
  const activos = banners.filter((b) => b.activo).sort((a, b) => a.orden - b.orden);

  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <Carousel
        opts={{ loop: true }}
        className="w-full"
      >
        <CarouselContent>
          {activos.map((banner) => (
            <CarouselItem key={banner.id}>
              <div
                className="flex min-h-32 flex-col items-center justify-center gap-1 rounded-xl px-6 py-8 text-center sm:min-h-36"
                style={{
                  backgroundColor: banner.colorFondo,
                  color: banner.colorTexto,
                }}
              >
                {banner.etiqueta && (
                  <span
                    className="mb-1 rounded-full px-3 py-0.5 text-xs font-semibold uppercase tracking-wide ring-1"
                    style={{ borderColor: banner.colorTexto }}
                  >
                    {banner.etiqueta}
                  </span>
                )}
                <p className="font-heading text-xl font-bold sm:text-2xl">
                  {banner.titulo}
                </p>
                {banner.subtitulo && (
                  <p className="text-sm opacity-90 sm:text-base">{banner.subtitulo}</p>
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>
    </section>
  );
}
