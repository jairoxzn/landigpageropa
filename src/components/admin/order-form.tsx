"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { WhatsappIcon } from "@/components/common/whatsapp-icon";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { formatPrice } from "@/lib/utils";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export interface AdminProductOption {
  id: string;
  name: string;
  price: number;
  coverImage: string;
  sizes: string[];
  colors: string[];
}

interface LineItem {
  productId: string;
  name: string;
  size: string;
  color: string;
  quantity: number;
  unitPrice: number;
  image: string;
}

type Channel = "WHATSAPP" | "INSTAGRAM" | "FACEBOOK" | "WEBSITE" | "STORE";

export function OrderForm({ products }: { products: AdminProductOption[] }) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [customer, setCustomer] = React.useState({
    fullName: "",
    phone: "",
    email: "",
    address: ""
  });
  const [channel, setChannel] = React.useState<Channel>("INSTAGRAM");
  const [notes, setNotes] = React.useState("");
  const [items, setItems] = React.useState<LineItem[]>([]);

  const subtotal = items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);

  const addProduct = (productId: string) => {
    const p = products.find((x) => x.id === productId);
    if (!p) return;
    setItems((arr) => [
      ...arr,
      {
        productId: p.id,
        name: p.name,
        size: p.sizes[0] || "",
        color: p.colors[0] || "",
        quantity: 1,
        unitPrice: p.price,
        image: p.coverImage
      }
    ]);
  };

  const updateItem = (idx: number, patch: Partial<LineItem>) => {
    setItems((arr) => arr.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  };

  const removeItem = (idx: number) => {
    setItems((arr) => arr.filter((_, i) => i !== idx));
  };

  const submit = async (e: React.FormEvent, openWhatsApp = false) => {
    e.preventDefault();
    if (items.length === 0) return toast.error("Agrega al menos un producto");
    if (!customer.fullName.trim()) return toast.error("Falta el nombre del cliente");
    if (!customer.phone.trim()) return toast.error("Falta el teléfono");

    const digits = customer.phone.replace(/\D/g, "");
    const phone = digits.startsWith("51") ? digits : `51${digits}`;

    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            fullName: customer.fullName.trim(),
            phone,
            email: customer.email.trim() || null,
            address: customer.address.trim() || null
          },
          items: items.map((i) => ({
            productId: i.productId,
            name: i.name,
            size: i.size || null,
            color: i.color || null,
            quantity: i.quantity,
            unitPrice: i.unitPrice
          })),
          channel,
          notes: notes.trim() || null
        })
      });
      const json = await res.json();
      if (!res.ok) return toast.error(json.error || "No se pudo crear el pedido");

      toast.success(`Pedido ${json.order.number} creado`);

      if (openWhatsApp && json.whatsappMessage) {
        window.open(
          buildWhatsAppUrl(json.whatsappMessage, phone),
          "_blank",
          "noopener,noreferrer"
        );
      }

      router.push(`/admin/pedidos/${json.order.id}`);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={(e) => submit(e, false)} className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        {/* Cliente */}
        <section className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-4">
          <h3 className="font-display text-lg font-semibold">Cliente</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Nombre completo *</Label>
              <Input
                required
                value={customer.fullName}
                onChange={(e) => setCustomer((c) => ({ ...c, fullName: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>WhatsApp *</Label>
              <Input
                required
                type="tel"
                placeholder="+51 999 999 999"
                value={customer.phone}
                onChange={(e) => setCustomer((c) => ({ ...c, phone: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Email (opcional)</Label>
              <Input
                type="email"
                value={customer.email}
                onChange={(e) => setCustomer((c) => ({ ...c, email: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Dirección (opcional)</Label>
              <Input
                value={customer.address}
                onChange={(e) => setCustomer((c) => ({ ...c, address: e.target.value }))}
              />
            </div>
          </div>
        </section>

        {/* Productos */}
        <section className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold">Productos</h3>
            <Select onValueChange={addProduct}>
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="+ Agregar producto" />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                {products.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name} — {formatPrice(p.price)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-10 border-2 border-dashed border-border rounded-xl text-sm text-muted-foreground">
              Selecciona productos del menú de arriba.
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((i, idx) => (
                <div
                  key={`${i.productId}-${idx}`}
                  className="grid grid-cols-[64px_1fr_auto] sm:grid-cols-[64px_1fr_90px_90px_90px_120px_auto] gap-3 items-center p-3 rounded-xl border border-border bg-muted/20"
                >
                  <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-accent">
                    <Image src={i.image} alt={i.name} fill sizes="64px" className="object-cover" />
                  </div>
                  <p className="font-medium text-sm truncate col-span-1 sm:col-span-1">
                    {i.name}
                  </p>
                  <Input
                    placeholder="Talla"
                    value={i.size}
                    onChange={(e) => updateItem(idx, { size: e.target.value })}
                    className="hidden sm:block"
                  />
                  <Input
                    placeholder="Color"
                    value={i.color}
                    onChange={(e) => updateItem(idx, { color: e.target.value })}
                    className="hidden sm:block"
                  />
                  <Input
                    type="number"
                    min={1}
                    value={i.quantity}
                    onChange={(e) => updateItem(idx, { quantity: Number(e.target.value) })}
                    className="hidden sm:block"
                  />
                  <Input
                    type="number"
                    step="0.01"
                    value={i.unitPrice}
                    onChange={(e) => updateItem(idx, { unitPrice: Number(e.target.value) })}
                    className="hidden sm:block"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(idx)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                  {/* Mobile compact row */}
                  <div className="col-span-3 sm:hidden flex gap-2">
                    <Input
                      placeholder="Talla"
                      value={i.size}
                      onChange={(e) => updateItem(idx, { size: e.target.value })}
                    />
                    <Input
                      placeholder="Color"
                      value={i.color}
                      onChange={(e) => updateItem(idx, { color: e.target.value })}
                    />
                    <Input
                      type="number"
                      min={1}
                      value={i.quantity}
                      onChange={(e) => updateItem(idx, { quantity: Number(e.target.value) })}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Notas */}
        <section className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-3">
          <h3 className="font-display text-lg font-semibold">Notas / Observaciones</h3>
          <Textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Referencias, preferencias de envío, etc."
          />
        </section>
      </div>

      <aside className="space-y-6">
        <section className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-4">
          <h3 className="font-display text-lg font-semibold">Canal</h3>
          <Select value={channel} onValueChange={(v) => setChannel(v as Channel)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="WHATSAPP">WhatsApp</SelectItem>
              <SelectItem value="INSTAGRAM">Instagram</SelectItem>
              <SelectItem value="FACEBOOK">Facebook</SelectItem>
              <SelectItem value="WEBSITE">Sitio web</SelectItem>
              <SelectItem value="STORE">Tienda física</SelectItem>
            </SelectContent>
          </Select>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <h3 className="font-display text-lg font-semibold mb-3">Resumen</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ítems</span>
              <span>{items.reduce((s, i) => s + i.quantity, 0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="border-t border-border pt-2 flex justify-between">
              <span className="font-semibold">Total</span>
              <span className="font-display text-xl font-bold text-primary">
                {formatPrice(subtotal)}
              </span>
            </div>
          </div>
        </section>

        <div className="space-y-2">
          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Crear pedido
          </Button>
          <Button
            type="button"
            variant="whatsapp"
            size="lg"
            className="w-full"
            disabled={loading}
            onClick={(e) => submit(e as any, true)}
          >
            <WhatsappIcon size={16} />
            Crear y enviar WhatsApp
          </Button>
        </div>
      </aside>
    </form>
  );
}
