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

interface Category { id: string; name: string }
interface ProductValues {
  id?: string;
  name?: string;
  slug?: string;
  sku?: string;
  description?: string;
  shortDesc?: string;
  price?: number;
  compareAt?: number;
  coverImage?: string;
  images?: string[];
  colors?: string[];
  sizes?: string[];
  categoryId?: string;
  isNew?: boolean;
  isFeatured?: boolean;
  isActive?: boolean;
}

export function ProductForm({
  product,
  categories
}: {
  product?: ProductValues;
  categories: Category[];
}) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [form, setForm] = React.useState<ProductValues>({
    name: "",
    slug: "",
    sku: "",
    description: "",
    shortDesc: "",
    price: 0,
    compareAt: undefined,
    coverImage: "",
    images: [],
    colors: [],
    sizes: [],
    categoryId: categories[0]?.id,
    isNew: false,
    isFeatured: false,
    isActive: true,
    ...product
  });
  const isEdit = !!product?.id;

  const set = <K extends keyof ProductValues>(k: K, v: ProductValues[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        slug: form.slug || slugify(form.name || ""),
        price: Number(form.price),
        compareAt: form.compareAt ? Number(form.compareAt) : undefined
      };
      const url = isEdit ? `/api/products/${product!.id}` : "/api/products";
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
      toast.success(isEdit ? "Producto actualizado" : "Producto creado");
      router.push("/admin/productos");
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  const remove = async () => {
    if (!product?.id) return;
    if (!confirm("¿Eliminar este producto?")) return;
    await fetch(`/api/products/${product.id}`, { method: "DELETE" });
    toast.success("Producto eliminado");
    router.push("/admin/productos");
    router.refresh();
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const data = new FormData();
    data.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: data });
    const json = await res.json();
    if (res.ok && json.url) {
      set("coverImage", json.url);
      set("images", [...(form.images || []), json.url]);
      toast.success("Imagen subida");
    } else {
      toast.error(json.error || "Error subiendo imagen");
    }
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-card">
            <h3 className="font-display text-lg font-semibold">Información básica</h3>
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
                <Label>SKU</Label>
                <Input value={form.sku || ""} onChange={(e) => set("sku", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Categoría *</Label>
                <select
                  required
                  className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm"
                  value={form.categoryId}
                  onChange={(e) => set("categoryId", e.target.value)}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Resumen corto</Label>
              <Input
                value={form.shortDesc || ""}
                onChange={(e) => set("shortDesc", e.target.value)}
                placeholder="Una línea atractiva para el listado"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Descripción *</Label>
              <Textarea
                required
                rows={5}
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-card">
            <h3 className="font-display text-lg font-semibold">Precio</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Precio (PEN) *</Label>
                <Input
                  required
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => set("price", Number(e.target.value))}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Precio comparativo (tachado)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={form.compareAt || ""}
                  onChange={(e) => set("compareAt", Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          {/* Variants */}
          <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-card">
            <h3 className="font-display text-lg font-semibold">Variantes</h3>
            <div className="space-y-1.5">
              <Label>Tallas (separadas por coma)</Label>
              <Input
                placeholder="XS, S, M, L"
                value={form.sizes?.join(", ") || ""}
                onChange={(e) =>
                  set(
                    "sizes",
                    e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                  )
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>Colores (separados por coma)</Label>
              <Input
                placeholder="Negro, Rosa, Blanco"
                value={form.colors?.join(", ") || ""}
                onChange={(e) =>
                  set(
                    "colors",
                    e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                  )
                }
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <h3 className="font-display text-lg font-semibold mb-4">Estado</h3>
            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm">Activo</span>
                <Switch checked={!!form.isActive} onCheckedChange={(v) => set("isActive", v)} />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm">Destacado</span>
                <Switch checked={!!form.isFeatured} onCheckedChange={(v) => set("isFeatured", v)} />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm">Marcar como nuevo</span>
                <Switch checked={!!form.isNew} onCheckedChange={(v) => set("isNew", v)} />
              </label>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <h3 className="font-display text-lg font-semibold mb-4">Imágenes</h3>
            <div className="space-y-3">
              <label className="block group cursor-pointer">
                <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
                <div className="relative aspect-[4/3] rounded-xl border-2 border-dashed border-border bg-muted/40 grid place-items-center text-center text-muted-foreground group-hover:border-primary transition-colors overflow-hidden">
                  {form.coverImage ? (
                    <Image src={form.coverImage} alt="" fill className="object-cover" />
                  ) : (
                    <div>
                      <UploadCloud className="h-7 w-7 mx-auto mb-2" />
                      <p className="text-xs">Subir imagen principal</p>
                    </div>
                  )}
                </div>
              </label>
              <Input
                placeholder="O pega una URL de imagen"
                value={form.coverImage || ""}
                onChange={(e) => set("coverImage", e.target.value)}
              />
            </div>
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
      </div>
    </form>
  );
}
