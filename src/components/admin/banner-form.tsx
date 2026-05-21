"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { Loader2, Save, Trash2, UploadCloud } from "lucide-react";
import { Input } from "@/components/ui/input";
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

interface Values {
  id?: string;
  title?: string;
  subtitle?: string;
  imageUrl?: string;
  mobileUrl?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  position?: "HERO" | "TOP_BAR" | "CATEGORY" | "CHECKOUT" | "FOOTER";
  order?: number;
  isActive?: boolean;
}

export function BannerForm({ banner }: { banner?: Values }) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [form, setForm] = React.useState<Values>({
    title: "",
    subtitle: "",
    imageUrl: "",
    mobileUrl: "",
    ctaLabel: "",
    ctaUrl: "",
    position: "HERO",
    order: 0,
    isActive: true,
    ...banner
  });
  const isEdit = !!banner?.id;

  const set = <K extends keyof Values>(k: K, v: Values[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const upload = async (e: React.ChangeEvent<HTMLInputElement>, field: "imageUrl" | "mobileUrl") => {
    const file = e.target.files?.[0];
    if (!file) return;
    const data = new FormData();
    data.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: data });
    const json = await res.json();
    if (res.ok) {
      set(field, json.url);
      toast.success("Imagen subida");
    } else toast.error(json.error || "Error subiendo imagen");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        order: Number(form.order || 0),
        subtitle: form.subtitle || null,
        mobileUrl: form.mobileUrl || null,
        ctaLabel: form.ctaLabel || null,
        ctaUrl: form.ctaUrl || null
      };
      const url = isEdit ? `/api/banners/${banner!.id}` : "/api/banners";
      const res = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error || "Error guardando");
        return;
      }
      toast.success(isEdit ? "Banner actualizado" : "Banner creado");
      router.push("/admin/banners");
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  const remove = async () => {
    if (!banner?.id) return;
    if (!confirm("¿Eliminar este banner?")) return;
    await fetch(`/api/banners/${banner.id}`, { method: "DELETE" });
    toast.success("Banner eliminado");
    router.push("/admin/banners");
    router.refresh();
  };

  return (
    <form onSubmit={submit} className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-card">
          <h3 className="font-display text-lg font-semibold">Contenido</h3>
          <div className="space-y-1.5">
            <Label>Título *</Label>
            <Input
              required
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Subtítulo</Label>
            <Input
              value={form.subtitle || ""}
              onChange={(e) => set("subtitle", e.target.value)}
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Texto del botón (CTA)</Label>
              <Input
                placeholder="Comprar ahora"
                value={form.ctaLabel || ""}
                onChange={(e) => set("ctaLabel", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Enlace del botón</Label>
              <Input
                placeholder="/catalogo"
                value={form.ctaUrl || ""}
                onChange={(e) => set("ctaUrl", e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-card">
          <h3 className="font-display text-lg font-semibold">Imágenes</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <ImageField
              label="Imagen desktop *"
              value={form.imageUrl}
              onUpload={(e) => upload(e, "imageUrl")}
              onUrl={(v) => set("imageUrl", v)}
              required
            />
            <ImageField
              label="Imagen móvil (opcional)"
              value={form.mobileUrl}
              onUpload={(e) => upload(e, "mobileUrl")}
              onUrl={(v) => set("mobileUrl", v)}
            />
          </div>
        </div>
      </div>

      <aside className="space-y-6">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-4">
          <h3 className="font-display text-lg font-semibold">Configuración</h3>
          <div className="space-y-1.5">
            <Label>Posición</Label>
            <Select
              value={form.position}
              onValueChange={(v) => set("position", v as Values["position"])}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="HERO">Hero (carrusel principal)</SelectItem>
                <SelectItem value="TOP_BAR">Top bar</SelectItem>
                <SelectItem value="CATEGORY">Categoría</SelectItem>
                <SelectItem value="CHECKOUT">Checkout</SelectItem>
                <SelectItem value="FOOTER">Footer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Orden</Label>
            <Input
              type="number"
              value={form.order || 0}
              onChange={(e) => set("order", Number(e.target.value))}
            />
          </div>
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm">Activo</span>
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

function ImageField({
  label,
  value,
  onUpload,
  onUrl,
  required
}: {
  label: string;
  value?: string;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUrl: (v: string) => void;
  required?: boolean;
}) {
  return (
    <div>
      <Label className="mb-2 block">{label}</Label>
      <label className="block group cursor-pointer mb-2">
        <input type="file" accept="image/*" className="hidden" onChange={onUpload} />
        <div className="relative aspect-[16/9] rounded-xl border-2 border-dashed border-border bg-muted/40 grid place-items-center overflow-hidden group-hover:border-primary transition-colors">
          {value ? (
            <Image src={value} alt="" fill className="object-cover" />
          ) : (
            <div className="text-center text-muted-foreground">
              <UploadCloud className="h-6 w-6 mx-auto mb-1" />
              <p className="text-xs">Subir</p>
            </div>
          )}
        </div>
      </label>
      <Input
        placeholder="URL de imagen"
        value={value || ""}
        onChange={(e) => onUrl(e.target.value)}
        required={required}
      />
    </div>
  );
}
