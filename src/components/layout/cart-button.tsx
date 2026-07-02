"use client";

import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { useCartStore, cartTotalItems } from "@/store/cart-store";

export function CartButton() {
  const { items, open } = useCartStore();
  const count = cartTotalItems(items);

  return (
    <button
      type="button"
      onClick={open}
      aria-label="Ver pedido"
      className="relative flex size-10 items-center justify-center rounded-full text-ink hover:bg-brand-tint"
    >
      <ShoppingCartIcon className="size-6" />
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex size-5 items-center justify-center rounded-full bg-offer text-[11px] font-bold text-offer-ink">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </button>
  );
}
