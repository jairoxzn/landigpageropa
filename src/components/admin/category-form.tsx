"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { Loader2, Save, Trash2, UploadCloud } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { slugify } from "@/lib/utils";

interface Values {
  id?: string;
  name?: string;
  slug?: string;
  description?: string;
  imageUrl?: string;
  isFeatured?: boolean;
  isActive?: boolean;
  order?: number;
}

export function CategoryForm({ category }: { category?: Values }) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [form, setForm] = React.useState<Values>({
    name: "",
    slug: "",
    description: "",
    imageUrl: "",
    isFeatured: false,
    isActive: true,
    order: 0,
    ...category
  });
  const isEdit = !!category?.id;

  const set = <K extends keyof Values>(k: K, v: Values[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const data = new FormData();
    data.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: data });
    const json = await res.json();
    if (res.ok) {
      set("imageUrl", json.url);
      toast.success("Imagen subida");
    } else toast.error(json.error || "Error subiendo imagen");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        slug: form.slug || slugify(form.name || ""),
        order: Number(form.order || 0)
      };
      const url = isEdit ? `/api/categories/${category!.id}` : "/api/categories";
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
      toast.success(isEdit ? "Categoría actualizada" : "Categoría creada");
      router.push("/admin/categorias");
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  const remove = async () => {
    if (!category?.id) return;
    if (!confirm("¿Eliminar esta categoría? Los productos deberán reasignarse.")) return;
    const res = await fetch(`/api/categories/${category.id}`, { method: "DELETE" });
    const json = await res.json();
    if (!res.ok) return toast.error(json.error || "No se pudo eliminar");
    toast.success("Categoría eliminada");
    router.push("/admin/categorias");
    router.refresh();
  };

  return (
    <form onSubmit={submit} className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-card">
          <h3 className="font-display text-lg font-semibold">Información</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Nombre *</Label>
              <Input
                required
                value={form.name}
                onChange={(e) => {
                  set("name", e.target.value);
                  if (!isEdit) set("slug", slugify(e.target.value));
                }}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Slug</Label>
              <Input value={form.slug} onChange={(e) => set("slug", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Orden de aparición</Label>
              <Input
                type="number"
                value={form.order || 0}
                onChange={(e) => set("order", Number(e.target.value))}
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
      </div>

      <aside className="space-y-6">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <h3 className="font-display text-lg font-semibold mb-4">Estado</h3>
          <label className="flex items-center justify-between cursor-pointer mb-3">
            <span className="text-sm">Activa</span>
            <Switch checked={!!form.isActive} onCheckedChange={(v) => set("isActive", v)} />
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm">Mostrar en home</span>
            <Switch checked={!!form.isFeatured} onCheckedChange={(v) => set("isFeatured", v)} />
          </label>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <h3 className="font-display text-lg font-semibold mb-4">Imagen</h3>
          <label className="block group cursor-pointer mb-3">
            <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
            <div className="relative aspect-[4/3] rounded-xl border-2 border-dashed border-border bg-muted/40 grid place-items-center overflow-hidden group-hover:border-primary transition-colors">
              {form.imageUrl ? (
                <Image src={form.imageUrl} alt="" fill className="object-cover" />
              ) : (
                <div className="text-center text-muted-foreground">
                  <UploadCloud className="h-7 w-7 mx-auto mb-2" />
                  <p className="text-xs">Subir imagen</p>
                </div>
              )}
            </div>
          </label>
          <Input
            placeholder="O pega una URL"
            value={form.imageUrl || ""}
            onChange={(e) => set("imageUrl", e.target.value)}
          />
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
