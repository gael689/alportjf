"use client";

import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  MinusIcon,
  PlusIcon,
  TrashIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import { useCartStore, cartTotalPrice, cartTotalPriceSinDescuento } from "@/store/cart-store";
import { formatPrice, calcularDescuento } from "@/lib/format";
import { whatsappPedidoCarrito } from "@/lib/whatsapp";
import { OfferCountdown } from "@/components/product/offer-countdown";
import { PromoPrice } from "@/components/product/promo-price";

export function CartDrawer() {
  const { items, isOpen, close, setCantidad, removeItem } = useCartStore();
  const total = cartTotalPrice(items);
  const totalSinDescuento = cartTotalPriceSinDescuento(items);
  const ahorro = totalSinDescuento - total;
  const hayAhorro = ahorro > 0;
  const hayItemsSinPrecio = items.some(
    (item) => item.producto.precioPromo == null && item.producto.precio === null
  );

  return (
    <Sheet open={isOpen} onOpenChange={(open) => (open ? undefined : close())}>
      <SheetContent side="right" className="flex w-full flex-col sm:!max-w-md">
        <SheetHeader className="border-b border-border">
          <SheetTitle className="flex items-center gap-2 font-heading text-lg">
            <ShoppingCartIcon className="size-5 text-brand" />
            Tu pedido
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <ShoppingCartIcon className="size-12 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">
              Todavía no agregaste productos a tu pedido.
            </p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-4">
            <ul className="flex flex-col gap-4 py-2">
              {items.map((item) => {
                const { producto } = item;
                const tienePrecio = producto.precio !== null;
                const tieneOferta =
                  tienePrecio && !!producto.precioPromo && producto.precioPromo < producto.precio!;
                const descuento = tieneOferta
                  ? calcularDescuento(producto.precio!, producto.precioPromo!)
                  : 0;
                const precio = tieneOferta ? producto.precioPromo! : producto.precio;

                return (
                  <li key={producto.id} className="flex gap-3">
                    <div className="relative size-16 shrink-0 overflow-hidden rounded-md border border-border bg-white">
                      {tieneOferta && (
                        <span className="absolute left-0 top-0 z-10 rounded-br-md bg-brand px-1.5 py-0.5 text-[10px] font-extrabold leading-none text-white">
                          -{descuento}%
                        </span>
                      )}
                      <Image
                        src={producto.imagen}
                        alt={producto.nombre}
                        fill
                        sizes="64px"
                        className="object-contain p-1"
                      />
                    </div>
                    <div className="flex flex-1 flex-col gap-1">
                      <p className="line-clamp-2 text-sm font-medium leading-snug">
                        {producto.nombre}
                      </p>
                      {tieneOferta ? (
                        <PromoPrice precio={producto.precio!} precioPromo={precio!} size="sm" />
                      ) : (
                        <p className="text-sm font-semibold text-brand">
                          {formatPrice(precio)}
                        </p>
                      )}
                      {tieneOferta && producto.ofertaHasta && (
                        <OfferCountdown
                          ofertaHasta={producto.ofertaHasta}
                          className="w-fit text-[11px]"
                        />
                      )}
                      <div className="mt-1 flex items-center gap-2">
                        <div className="flex items-center rounded-md border border-border">
                          <button
                            type="button"
                            aria-label="Restar cantidad"
                            className="flex size-7 items-center justify-center text-muted-foreground hover:text-ink"
                            onClick={() =>
                              setCantidad(item.producto.id, item.cantidad - 1)
                            }
                          >
                            <MinusIcon className="size-3.5" />
                          </button>
                          <span className="w-6 text-center text-sm tabular-nums">
                            {item.cantidad}
                          </span>
                          <button
                            type="button"
                            aria-label="Sumar cantidad"
                            className="flex size-7 items-center justify-center text-muted-foreground hover:text-ink"
                            onClick={() =>
                              setCantidad(item.producto.id, item.cantidad + 1)
                            }
                          >
                            <PlusIcon className="size-3.5" />
                          </button>
                        </div>
                        <button
                          type="button"
                          aria-label="Quitar del pedido"
                          className="flex size-7 items-center justify-center text-muted-foreground hover:text-destructive"
                          onClick={() => removeItem(item.producto.id)}
                        >
                          <TrashIcon className="size-4" />
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {items.length > 0 && (
          <SheetFooter className="border-t border-border">
            <div className="flex w-full flex-col gap-3">
              <Separator />
              <div className="flex items-end justify-between">
                <span className="text-base font-semibold">Total</span>
                {hayAhorro ? (
                  <PromoPrice
                    precio={totalSinDescuento}
                    precioPromo={total}
                    size="lg"
                    className="items-end"
                  />
                ) : (
                  <span className="text-2xl font-extrabold text-brand">
                    {formatPrice(total)}
                  </span>
                )}
              </div>
              {hayAhorro && (
                <p className="-mt-1 w-fit self-end rounded-full bg-offer px-2.5 py-1 text-xs font-bold text-offer-ink">
                  ¡Ahorrás {formatPrice(ahorro)}!
                </p>
              )}
              {hayItemsSinPrecio && (
                <p className="text-xs text-muted-foreground">
                  No incluye los productos a consultar — te confirmamos el precio por WhatsApp.
                </p>
              )}
              <Button
                render={<a href={whatsappPedidoCarrito(items, total)} target="_blank" rel="noopener noreferrer" />}
                nativeButton={false}
                size="lg"
                className="w-full bg-success text-white hover:bg-success/90"
              >
                Enviar pedido por WhatsApp
              </Button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
