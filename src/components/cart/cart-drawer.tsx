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
import { useCartStore, cartTotalPrice } from "@/store/cart-store";
import { formatPrice } from "@/lib/format";
import { whatsappPedidoCarrito } from "@/lib/whatsapp";

export function CartDrawer() {
  const { items, isOpen, close, setCantidad, removeItem } = useCartStore();
  const total = cartTotalPrice(items);

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
                const precio = item.producto.precioPromo ?? item.producto.precio;
                return (
                  <li key={item.producto.id} className="flex gap-3">
                    <div className="relative size-16 shrink-0 overflow-hidden rounded-md border border-border bg-white">
                      <Image
                        src={item.producto.imagen}
                        alt={item.producto.nombre}
                        fill
                        sizes="64px"
                        className="object-contain p-1"
                      />
                    </div>
                    <div className="flex flex-1 flex-col gap-1">
                      <p className="line-clamp-2 text-sm font-medium leading-snug">
                        {item.producto.nombre}
                      </p>
                      <p className="text-sm font-semibold text-brand">
                        {formatPrice(precio)}
                      </p>
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
              <div className="flex items-center justify-between text-base font-semibold">
                <span>Total</span>
                <span className="text-brand">{formatPrice(total)}</span>
              </div>
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
