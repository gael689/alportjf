"use client";

import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { useCartStore, cartTotalItems } from "@/store/cart-store";

export function FloatingCartButton() {
  const { items, open } = useCartStore();
  const count = cartTotalItems(items);

  if (count === 0) return null;

  return (
    <button
      type="button"
      onClick={open}
      aria-label={`Ver pedido (${count} producto${count !== 1 ? "s" : ""})`}
      className="fixed bottom-24 right-5 z-40 flex size-14 items-center justify-center rounded-full bg-brand text-white shadow-lg shadow-black/20 transition-transform hover:scale-105"
    >
      <ShoppingCartIcon className="size-6" />
      <span className="absolute -top-1 -right-1 flex size-6 items-center justify-center rounded-full bg-offer text-xs font-bold text-offer-ink ring-2 ring-white">
        {count > 9 ? "9+" : count}
      </span>
    </button>
  );
}
