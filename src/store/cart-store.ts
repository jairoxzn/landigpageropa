"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  productId: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  size?: string;
  color?: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  add: (item: CartItem) => void;
  remove: (productId: string, size?: string, color?: string) => void;
  updateQty: (productId: string, qty: number, size?: string, color?: string) => void;
  clear: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

const keyOf = (i: Pick<CartItem, "productId" | "size" | "color">) =>
  `${i.productId}|${i.size ?? ""}|${i.color ?? ""}`;

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set({ isOpen: !get().isOpen }),
      add: (item) => {
        const items = [...get().items];
        const idx = items.findIndex((i) => keyOf(i) === keyOf(item));
        if (idx >= 0) {
          items[idx].quantity += item.quantity;
        } else {
          items.push(item);
        }
        set({ items, isOpen: true });
      },
      remove: (productId, size, color) =>
        set({
          items: get().items.filter(
            (i) => keyOf(i) !== keyOf({ productId, size, color })
          )
        }),
      updateQty: (productId, qty, size, color) =>
        set({
          items: get()
            .items.map((i) =>
              keyOf(i) === keyOf({ productId, size, color })
                ? { ...i, quantity: Math.max(1, qty) }
                : i
            )
        }),
      clear: () => set({ items: [] }),
      totalItems: () => get().items.reduce((s, i) => s + i.quantity, 0),
      totalPrice: () =>
        get().items.reduce((s, i) => s + i.price * i.quantity, 0)
    }),
    { name: "lucia-cart" }
  )
);
