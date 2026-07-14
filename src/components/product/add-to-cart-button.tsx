"use client";

import { useState } from "react";
import { toast } from "sonner";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { MinusIcon, PlusIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";
import type { Producto } from "@/data/types";
import { useCartStore } from "@/store/cart-store";
import { Button } from "@/components/ui/button";

export function AddToCartButton({ producto }: { producto: Producto }) {
  const [cantidad, setCantidad] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.open);

  function handleAgregar() {
    addItem(producto, cantidad);
    toast.success(`${producto.nombre} se agregó al pedido`, {
      icon: <CheckCircleIcon className="size-5 text-success" />,
      description: cantidad > 1 ? `Cantidad: ${cantidad}` : undefined,
      action: {
        label: "Ver pedido",
        onClick: () => openCart(),
      },
    });
  }

  return (
    <div className="flex flex-1 items-center gap-3">
      <div className="flex items-center rounded-lg border border-border">
        <button
          type="button"
          aria-label="Restar cantidad"
          className="flex size-12 items-center justify-center text-muted-foreground hover:text-ink"
          onClick={() => setCantidad((c) => Math.max(1, c - 1))}
        >
          <MinusIcon className="size-4" />
        </button>
        <span className="w-8 text-center text-base font-medium tabular-nums">
          {cantidad}
        </span>
        <button
          type="button"
          aria-label="Sumar cantidad"
          className="flex size-12 items-center justify-center text-muted-foreground hover:text-ink"
          onClick={() => setCantidad((c) => c + 1)}
        >
          <PlusIcon className="size-4" />
        </button>
      </div>
      <Button
        size="lg"
        className="h-12 flex-1 bg-brand text-white hover:bg-brand-dark"
        onClick={handleAgregar}
      >
        <ShoppingCartIcon className="size-5" />
        Agregar al pedido
      </Button>
    </div>
  );
}
