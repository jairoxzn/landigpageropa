"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Save, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

type PromoType = "PERCENT" | "FIXED" | "BUY_X_GET_Y" | "FREE_SHIPPING";

interface Values {
  id?: string;
  name?: string;
  code?: string;
  type?: PromoType;
  value?: number;
  description?: string;
  startsAt?: string;
  endsAt?: string;
  isActive?: boolean;
}

function toDateInput(d?: string | Date) {
  if (!d) return "";
  return new Date(d).toISOString().slice(0, 16);
}

export function PromotionForm({ promotion }: { promotion?: Values }) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [form, setForm] = React.useState<Values>({
    name: "",
    code: "",
    type: "PERCENT",
    value: 10,
    description: "",
    startsAt: toDateInput(new Date()),
    endsAt: toDateInput(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)),
    isActive: true,
    ...(promotion && {
      ...promotion,
      startsAt: toDateInput(promotion.startsAt),
      endsAt: toDateInput(promotion.endsAt)
    })
  });
  const isEdit = !!promotion?.id;

  const set = <K extends keyof Values>(k: K, v: Values[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        value: Number(form.value || 0),
        code: form.code || null,
        description: form.description || null
      };
      const url = isEdit
        ? `/api/promotions/${promotion!.id}`
        : "/api/promotions";
      const res = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (!res.ok) return toast.error(json.error || "Error guardando");
      toast.success(isEdit ? "Promoción actualizada" : "Promoción creada");
      router.push("/admin/promociones");
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  const remove = async () => {
    if (!promotion?.id) return;
    if (!confirm("¿Eliminar esta promoción?")) return;
    await fetch(`/api/promotions/${promotion.id}`, { method: "DELETE" });
    toast.success("Promoción eliminada");
    router.push("/admin/promociones");
    router.refresh();
  };

  return (
    <form onSubmit={submit} className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-card">
          <h3 className="font-display text-lg font-semibold">Detalles</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Nombre *</Label>
              <Input
                required
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Código (cupón)</Label>
              <Input
                placeholder="LUCIA15"
                value={form.code || ""}
                onChange={(e) => set("code", e.target.value.toUpperCase())}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Tipo *</Label>
              <Select
                value={form.type}
                onValueChange={(v) => set("type", v as PromoType)}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="PERCENT">Descuento %</SelectItem>
                  <SelectItem value="FIXED">Descuento fijo</SelectItem>
                  <SelectItem value="BUY_X_GET_Y">Compra X, lleva Y</SelectItem>
                  <SelectItem value="FREE_SHIPPING">Envío gratis</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>
                Valor {form.type === "PERCENT" ? "(%)" : form.type === "FIXED" ? "(S/)" : ""}
              </Label>
              <Input
                type="number"
                step="0.01"
                value={form.value || 0}
                onChange={(e) => set("value", Number(e.target.value))}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Descripción</Label>
            <Textarea
              rows={3}
              value={form.description || ""}
              onChange={(e) => set("description", e.target.value)}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-card">
          <h3 className="font-display text-lg font-semibold">Vigencia</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Inicio *</Label>
              <Input
                required
                type="datetime-local"
                value={form.startsAt}
                onChange={(e) => set("startsAt", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Fin *</Label>
              <Input
                required
                type="datetime-local"
                value={form.endsAt}
                onChange={(e) => set("endsAt", e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <aside className="space-y-6">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <h3 className="font-display text-lg font-semibold mb-4">Estado</h3>
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm">Activa</span>
            <Switch checked={!!form.isActive} onCheckedChange={(v) => set("isActive", v)} />
          </label>
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Guardar
          </Button>
          {isEdit && (
            <Button type="button" variant="destructive" size="icon" onClick={remove}>
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </aside>
    </form>
  );
}
