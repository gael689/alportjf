"use client";

import { useEffect, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  useCarousel,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import type { PromoBanner } from "@/data/types";

function CarouselDots({ count }: { count: number }) {
  const { api } = useCarousel();
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setSelected(api.selectedScrollSnap());
    onSelect();
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  return (
    <div className="mt-4 flex items-center justify-center gap-2">
      {Array.from({ length: count }).map((_, index) => (
        <button
          key={index}
          type="button"
          aria-label={`Ir a la promo ${index + 1}`}
          onClick={() => api?.scrollTo(index)}
          className={cn(
            "h-2 rounded-full transition-all",
            index === selected ? "w-6 bg-brand" : "w-2 bg-ink/20 hover:bg-ink/40"
          )}
        />
      ))}
    </div>
  );
}

export function PromoCarousel({ banners }: { banners: PromoBanner[] }) {
  const activos = banners.filter((b) => b.activo).sort((a, b) => a.orden - b.orden);

  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <Carousel
        opts={{ loop: true }}
        plugins={[
          Autoplay({
            delay: 4500,
            stopOnInteraction: false,
            stopOnMouseEnter: true,
          }),
        ]}
        className="w-full"
      >
        <CarouselContent>
          {activos.map((banner) => (
            <CarouselItem key={banner.id}>
              <div
                className="relative flex min-h-32 flex-col items-center justify-center gap-1 overflow-hidden rounded-xl bg-cover bg-center px-6 py-8 text-center sm:min-h-36"
                style={{
                  backgroundColor: banner.colorFondo,
                  backgroundImage: banner.imagenUrl ? `url(${banner.imagenUrl})` : undefined,
                  color: banner.colorTexto,
                }}
              >
                {banner.imagenUrl && (
                  <div className="absolute inset-0 bg-black/40" aria-hidden="true" />
                )}
                <div className="relative z-10 flex flex-col items-center gap-1">
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
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
        {activos.length > 1 && <CarouselDots count={activos.length} />}
      </Carousel>
    </section>
  );
}
