import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Producto } from "@/data/types";

export type CartItem = {
  producto: Producto;
  cantidad: number;
};

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  addItem: (producto: Producto, cantidad?: number) => void;
  removeItem: (productoId: string) => void;
  setCantidad: (productoId: string, cantidad: number) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      addItem: (producto, cantidad = 1) =>
        set((state) => {
          const existente = state.items.find((i) => i.producto.id === producto.id);
          if (existente) {
            return {
              items: state.items.map((i) =>
                i.producto.id === producto.id
                  ? { ...i, cantidad: i.cantidad + cantidad }
                  : i
              ),
            };
          }
          return { items: [...state.items, { producto, cantidad }] };
        }),
      removeItem: (productoId) =>
        set((state) => ({
          items: state.items.filter((i) => i.producto.id !== productoId),
        })),
      setCantidad: (productoId, cantidad) =>
        set((state) => ({
          items:
            cantidad <= 0
              ? state.items.filter((i) => i.producto.id !== productoId)
              : state.items.map((i) =>
                  i.producto.id === productoId ? { ...i, cantidad } : i
                ),
        })),
      clear: () => set({ items: [] }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set((state) => ({ isOpen: !state.isOpen })),
    }),
    {
      name: "alport-cart",
      partialize: (state) => ({ items: state.items }),
    }
  )
);

export function cartTotalItems(items: CartItem[]): number {
  return items.reduce((acc, i) => acc + i.cantidad, 0);
}

export function cartTotalPrice(items: CartItem[]): number {
  return items.reduce(
    (acc, i) => acc + (i.producto.precioPromo ?? i.producto.precio) * i.cantidad,
    0
  );
}
