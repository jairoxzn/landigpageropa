"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X, Trash2, ShoppingBag, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/cart-store";
import { formatPrice } from "@/lib/utils";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export function CartDrawer() {
  const { isOpen, close, items, remove, updateQty, totalPrice, clear } = useCart();

  const checkoutMessage = React.useMemo(() => {
    if (items.length === 0) return "";
    const lines = items
      .map(
        (i) =>
          `• ${i.name} (${i.size ?? ""} ${i.color ?? ""}) x${i.quantity} – ${formatPrice(
            i.price * i.quantity
          )}`
      )
      .join("\n");
    return `¡Hola Lucia Jeans! Quiero hacer este pedido:\n\n${lines}\n\n*Total:* ${formatPrice(
      totalPrice()
    )}`;
  }, [items, totalPrice]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={close}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 240 }}
            className="fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] bg-background border-l border-border shadow-card flex flex-col"
          >
            <header className="flex items-center justify-between p-5 border-b">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-primary" />
                <h3 className="font-display text-xl font-bold">Tu carrito</h3>
              </div>
              <button onClick={close} aria-label="Cerrar">
                <X className="h-5 w-5" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground">
                  <ShoppingBag className="h-12 w-12 mb-3 opacity-50" />
                  <p>Tu carrito está vacío.</p>
                  <Button asChild className="mt-4" onClick={close}>
                    <Link href="/catalogo">Ir al catálogo</Link>
                  </Button>
                </div>
              ) : (
                items.map((i) => (
                  <div key={`${i.productId}${i.size}${i.color}`} className="flex gap-3">
                    <div className="relative h-20 w-20 rounded-xl overflow-hidden bg-accent shrink-0">
                      <Image src={i.image} alt={i.name} fill sizes="80px" className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{i.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {i.size && `Talla ${i.size}`} {i.color && ` · ${i.color}`}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="inline-flex items-center rounded-full border border-border">
                          <button
                            onClick={() =>
                              updateQty(i.productId, i.quantity - 1, i.size, i.color)
                            }
                            className="h-8 w-8 rounded-l-full hover:bg-accent text-sm"
                          >
                            −
                          </button>
                          <span className="w-8 text-center text-sm">{i.quantity}</span>
                          <button
                            onClick={() =>
                              updateQty(i.productId, i.quantity + 1, i.size, i.color)
                            }
                            className="h-8 w-8 rounded-r-full hover:bg-accent text-sm"
                          >
                            +
                          </button>
                        </div>
                        <p className="text-sm font-semibold">
                          {formatPrice(i.price * i.quantity)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => remove(i.productId, i.size, i.color)}
                      className="text-muted-foreground hover:text-destructive"
                      aria-label="Eliminar"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <footer className="border-t p-5 space-y-3 bg-muted/20">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Subtotal</span>
                  <span className="font-display text-xl font-bold">
                    {formatPrice(totalPrice())}
                  </span>
                </div>
                <Button
                  asChild
                  variant="whatsapp"
                  size="lg"
                  className="w-full"
                >
                  <a
                    href={buildWhatsAppUrl(checkoutMessage)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="h-4 w-4" /> Finalizar por WhatsApp
                  </a>
                </Button>
                <button
                  onClick={clear}
                  className="text-xs text-muted-foreground hover:text-destructive w-full text-center"
                >
                  Vaciar carrito
                </button>
              </footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
