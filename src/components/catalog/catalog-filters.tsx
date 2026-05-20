"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { cn, formatPrice } from "@/lib/utils";

const SIZES = ["XS", "S", "M", "L", "XL", "26", "28", "30", "32", "34", "Única"];

interface Props {
  categories: { id: string; name: string; slug: string }[];
  total: number;
}

export function CatalogFilters({ categories, total }: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const update = (patch: Record<string, string | null>) => {
    const url = new URLSearchParams(params.toString());
    Object.entries(patch).forEach(([k, v]) => {
      if (v === null || v === "") url.delete(k);
      else url.set(k, v);
    });
    router.push(`/catalogo?${url.toString()}`);
  };

  const activeCat = params.get("categoria") || "";
  const activeSizes = (params.get("tallas") || "").split(",").filter(Boolean);
  const search = params.get("q") || "";
  const sort = params.get("orden") || "newest";
  const priceMin = Number(params.get("min") || 0);
  const priceMax = Number(params.get("max") || 1000);

  const toggleSize = (s: string) => {
    const next = activeSizes.includes(s)
      ? activeSizes.filter((x) => x !== s)
      : [...activeSizes, s];
    update({ tallas: next.length ? next.join(",") : null });
  };

  return (
    <div className="mb-8">
      {/* Top bar */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar prendas, colores, estilos…"
            value={search}
            onChange={(e) => update({ q: e.target.value || null })}
            className="pl-9"
          />
        </div>

        <Select
          value={sort}
          onValueChange={(v) => update({ orden: v === "newest" ? null : v })}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Ordenar" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Más recientes</SelectItem>
            <SelectItem value="price_asc">Precio: menor a mayor</SelectItem>
            <SelectItem value="price_desc">Precio: mayor a menor</SelectItem>
            <SelectItem value="popular">Más populares</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          onClick={() => setMobileOpen((v) => !v)}
          className="lg:hidden"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filtros
        </Button>
      </div>

      {/* Filters bar (desktop + collapsible mobile) */}
      <div
        className={cn(
          "rounded-2xl border border-border bg-card p-5 shadow-sm",
          "lg:block",
          mobileOpen ? "block" : "hidden lg:block"
        )}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Categories */}
          <div>
            <p className="text-xs uppercase tracking-wider font-semibold mb-3 text-muted-foreground">
              Categorías
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => update({ categoria: null })}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
                  !activeCat
                    ? "bg-primary text-white border-primary"
                    : "bg-background border-border hover:border-primary"
                )}
              >
                Todas
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() =>
                    update({ categoria: c.slug === activeCat ? null : c.slug })
                  }
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
                    activeCat === c.slug
                      ? "bg-primary text-white border-primary"
                      : "bg-background border-border hover:border-primary"
                  )}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div>
            <p className="text-xs uppercase tracking-wider font-semibold mb-3 text-muted-foreground">
              Tallas
            </p>
            <div className="flex flex-wrap gap-2">
              {SIZES.map((s) => (
                <button
                  key={s}
                  onClick={() => toggleSize(s)}
                  className={cn(
                    "h-9 min-w-9 px-3 rounded-full text-xs font-medium border transition-colors",
                    activeSizes.includes(s)
                      ? "bg-black text-white border-black"
                      : "bg-background border-border hover:border-primary"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Price */}
          <div>
            <p className="text-xs uppercase tracking-wider font-semibold mb-3 text-muted-foreground">
              Precio
            </p>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={priceMin || ""}
                onChange={(e) => update({ min: e.target.value || null })}
              />
              <span className="text-muted-foreground">—</span>
              <Input
                type="number"
                placeholder="Max"
                value={priceMax !== 1000 ? priceMax : ""}
                onChange={(e) => update({ max: e.target.value || null })}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Rango: {formatPrice(priceMin)} – {formatPrice(priceMax)}
            </p>
          </div>
        </div>

        {/* Active filters */}
        {(activeCat || activeSizes.length > 0 || search) && (
          <div className="mt-5 pt-4 border-t border-border flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground mr-1">
              Filtros activos:
            </span>
            {activeCat && (
              <Badge variant="soft" className="gap-1">
                {activeCat}
                <button onClick={() => update({ categoria: null })}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {activeSizes.map((s) => (
              <Badge key={s} variant="soft" className="gap-1">
                Talla {s}
                <button onClick={() => toggleSize(s)}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {search && (
              <Badge variant="soft" className="gap-1">
                "{search}"
                <button onClick={() => update({ q: null })}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            <button
              onClick={() => router.push("/catalogo")}
              className="ml-auto text-xs text-primary font-medium hover:underline"
            >
              Limpiar todo
            </button>
          </div>
        )}
      </div>

      <p className="text-sm text-muted-foreground mt-4">
        {total} {total === 1 ? "producto" : "productos"} encontrados
      </p>
    </div>
  );
}
