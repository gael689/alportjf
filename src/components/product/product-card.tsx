"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import type { Producto } from "@/data/types";
import { formatPrice, calcularDescuento } from "@/lib/format";
import { useCartStore } from "@/store/cart-store";
import { whatsappConsultaProducto } from "@/lib/whatsapp";
import { OfferCountdown } from "@/components/product/offer-countdown";
import { Button } from "@/components/ui/button";

export function ProductCard({ producto }: { producto: Producto }) {
  const addItem = useCartStore((s) => s.addItem);
  const tieneOferta = !!producto.precioPromo && producto.precioPromo < producto.precio;
  const descuento = tieneOferta
    ? calcularDescuento(producto.precio, producto.precioPromo!)
    : 0;

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-border bg-white transition-shadow hover:shadow-md">
      <Link
        href={`/producto/${producto.slug}`}
        className="relative block aspect-square bg-white"
      >
        {tieneOferta && (
          <span className="absolute left-2 top-2 z-10 rounded-md bg-offer px-2 py-1 text-xs font-extrabold text-offer-ink shadow-sm">
            -{descuento}%
          </span>
        )}
        {producto.nuevo && !tieneOferta && (
          <span className="absolute left-2 top-2 z-10 rounded-md bg-ink px-2 py-1 text-xs font-bold text-white shadow-sm">
            NUEVO
          </span>
        )}
        <Image
          src={producto.imagen}
          alt={producto.nombre}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-contain p-6 transition-transform duration-200 group-hover:scale-105"
        />
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        {producto.marca && (
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {producto.marca}
          </span>
        )}
        <Link href={`/producto/${producto.slug}`}>
          <h3 className="line-clamp-2 min-h-10 text-sm font-semibold leading-snug text-ink hover:text-brand">
            {producto.nombre}
          </h3>
        </Link>

        <div className="mt-1 flex flex-col gap-0.5">
          {tieneOferta ? (
            <>
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(producto.precio)}
              </span>
              <span className="text-xl font-extrabold text-success">
                {formatPrice(producto.precioPromo!)}
              </span>
            </>
          ) : (
            <span className="text-xl font-extrabold text-ink">
              {formatPrice(producto.precio)}
            </span>
          )}
        </div>

        {producto.ofertaHasta && tieneOferta && (
          <OfferCountdown ofertaHasta={producto.ofertaHasta} className="mt-0.5 w-fit" />
        )}

        <div className="mt-auto flex flex-col gap-2 pt-3">
          <Button
            size="sm"
            className="w-full bg-brand text-white hover:bg-brand-dark"
            onClick={() => addItem(producto, 1)}
          >
            <ShoppingCartIcon className="size-4" />
            Agregar al pedido
          </Button>
          <Button
            render={
              <a
                href={whatsappConsultaProducto(
                  producto.nombre,
                  `https://alportjfpuan.com.ar/producto/${producto.slug}`
                )}
                target="_blank"
                rel="noopener noreferrer"
              />
            }
            nativeButton={false}
            size="sm"
            variant="outline"
            className="w-full border-success text-success hover:bg-success/10"
          >
            Consultar por WhatsApp
          </Button>
        </div>
      </div>
    </div>
  );
}
