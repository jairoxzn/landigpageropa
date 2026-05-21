"use client";

import * as React from "react";
import { toast } from "sonner";
import { Loader2, MessageCircle, ShieldCheck, Truck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/store/cart-store";
import { formatPrice } from "@/lib/utils";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CheckoutDialog({ open, onOpenChange }: Props) {
  const { items, totalPrice, clear, close } = useCart();
  const [loading, setLoading] = React.useState(false);
  const [form, setForm] = React.useState({
    fullName: "",
    phone: "",
    address: "",
    notes: ""
  });

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Tu carrito está vacío");
      return;
    }

    // Normalize phone: keep digits, ensure country code
    const digits = form.phone.replace(/\D/g, "");
    if (digits.length < 8) {
      toast.error("Ingresa un número de WhatsApp válido");
      return;
    }
    const phone = digits.startsWith("51") ? digits : `51${digits}`;

    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            fullName: form.fullName.trim(),
            phone,
            address: form.address.trim() || null
          },
          items: items.map((i) => ({
            productId: i.productId,
            name: i.name,
            size: i.size || null,
            color: i.color || null,
            quantity: i.quantity,
            unitPrice: i.price
          })),
          channel: "WEBSITE",
          notes: form.notes.trim() || null
        })
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error || "No se pudo crear el pedido");
        return;
      }

      // Success: clear cart, close drawers, open WhatsApp
      toast.success(`Pedido ${json.order.number} creado 💖`);
      clear();
      onOpenChange(false);
      close();

      const url = buildWhatsAppUrl(json.whatsappMessage);
      // Use window.open with a small delay so the toast renders first
      setTimeout(() => window.open(url, "_blank", "noopener,noreferrer"), 100);
    } catch {
      toast.error("Error de red. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        <div className="grid md:grid-cols-[1fr_280px]">
          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            <DialogTitle className="mb-1">Confirmar pedido</DialogTitle>
            <DialogDescription className="mb-6">
              Llena estos datos y te llevaremos a WhatsApp con tu pedido listo.
            </DialogDescription>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="ck-name">Nombre completo *</Label>
                <Input
                  id="ck-name"
                  required
                  placeholder="Ej. Camila Torres"
                  value={form.fullName}
                  onChange={(e) => set("fullName", e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="ck-phone">WhatsApp *</Label>
                <Input
                  id="ck-phone"
                  required
                  type="tel"
                  placeholder="+51 999 999 999"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Lo usamos para enviarte la confirmación y el seguimiento.
                </p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="ck-address">Dirección / Distrito (opcional)</Label>
                <Input
                  id="ck-address"
                  placeholder="Ej. Av. La Marina 123, San Miguel"
                  value={form.address}
                  onChange={(e) => set("address", e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="ck-notes">Notas adicionales</Label>
                <Textarea
                  id="ck-notes"
                  rows={3}
                  placeholder="Indica color de empaque, referencia para envío, etc."
                  value={form.notes}
                  onChange={(e) => set("notes", e.target.value)}
                />
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              variant="whatsapp"
              className="w-full mt-6"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <MessageCircle className="h-4 w-4" />
              )}
              Confirmar y enviar por WhatsApp
            </Button>

            <ul className="mt-6 grid grid-cols-2 gap-3 text-xs text-muted-foreground">
              <li className="flex items-center gap-2">
                <Truck className="h-3.5 w-3.5 text-primary" /> Envío 24-72h
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Datos seguros
              </li>
            </ul>
          </form>

          {/* Resumen */}
          <aside className="bg-muted/40 p-6 md:p-7 border-t md:border-t-0 md:border-l border-border">
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
              Tu pedido
            </p>
            <ul className="space-y-3 max-h-72 overflow-y-auto scrollbar-pretty pr-1">
              {items.map((i) => (
                <li
                  key={`${i.productId}${i.size}${i.color}`}
                  className="flex justify-between text-sm gap-3"
                >
                  <div className="min-w-0">
                    <p className="font-medium truncate">{i.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {i.size && `T${i.size}`} {i.color && `· ${i.color}`} · x{i.quantity}
                    </p>
                  </div>
                  <p className="font-semibold whitespace-nowrap">
                    {formatPrice(i.price * i.quantity)}
                  </p>
                </li>
              ))}
            </ul>

            <Separator className="my-5" />

            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(totalPrice())}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Envío</span>
                <span className="text-xs text-emerald-600 font-medium">
                  A coordinar
                </span>
              </div>
              <div className="flex justify-between pt-3 border-t border-border">
                <span className="font-semibold">Total</span>
                <span className="font-display text-xl font-bold text-primary">
                  {formatPrice(totalPrice())}
                </span>
              </div>
            </div>
          </aside>
        </div>
      </DialogContent>
    </Dialog>
  );
}
