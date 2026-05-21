"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { ShoppingBag, Share2 } from "lucide-react";
import { WhatsappIcon } from "@/components/common/whatsapp-icon";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, formatPrice, discountPercent } from "@/lib/utils";
import { whatsappProductInquiry } from "@/lib/whatsapp";
import { useCart } from "@/store/cart-store";
import type { ProductCardData } from "./product-card";
import { SizeGuideDialog } from "./size-guide-dialog";

interface Props {
  product: ProductCardData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuickView({ product, open, onOpenChange }: Props) {
  const [size, setSize] = React.useState<string | undefined>(product.sizes?.[0]);
  const [color, setColor] = React.useState<string | undefined>(product.colors?.[0]);
  const [qty, setQty] = React.useState(1);
  const [sizeGuideOpen, setSizeGuideOpen] = React.useState(false);
  const addToCart = useCart((s) => s.add);
  const off = discountPercent(product.price, product.compareAt ?? undefined);

  const handleAdd = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.coverImage,
      size,
      color,
      quantity: qty
    });
    toast.success("Agregado al carrito", {
      description: `${product.name} (${size || ""} ${color || ""})`
    });
    onOpenChange(false);
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/producto/${product.slug}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: product.name, url });
      } catch {}
    } else {
      navigator.clipboard.writeText(url);
      toast.success("Enlace copiado");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Image */}
          <div className="relative aspect-square md:aspect-auto md:h-full bg-accent">
            <Image
              src={product.coverImage}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute top-3 left-3 flex gap-2">
              {product.isNew && <Badge variant="new">Nuevo</Badge>}
              {off > 0 && <Badge variant="sale">-{off}%</Badge>}
            </div>
          </div>

          {/* Details */}
          <div className="p-6 md:p-8 flex flex-col">
            {product.category && (
              <span className="eyebrow mb-2">{product.category.name}</span>
            )}
            <DialogTitle className="mb-2">{product.name}</DialogTitle>
            <DialogDescription className="text-sm mb-4">
              {product.shortDesc || product.description?.slice(0, 140)}
            </DialogDescription>

            <div className="flex items-center gap-3 mb-6">
              <span className="font-display text-2xl font-bold">
                {formatPrice(product.price)}
              </span>
              {product.compareAt && product.compareAt > product.price && (
                <span className="text-base text-muted-foreground line-through">
                  {formatPrice(product.compareAt)}
                </span>
              )}
            </div>

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                    Talla
                  </p>
                  <button
                    type="button"
                    onClick={() => setSizeGuideOpen(true)}
                    className="text-xs text-primary hover:underline"
                  >
                    Guía de tallas
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={cn(
                        "h-10 min-w-10 px-3 rounded-full text-sm font-medium border transition-all",
                        size === s
                          ? "bg-black text-white border-black"
                          : "bg-background border-border hover:border-primary"
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-5">
                <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-2">
                  Color
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className={cn(
                        "h-10 px-3 rounded-full text-sm border transition-all",
                        color === c
                          ? "bg-primary text-white border-primary"
                          : "bg-background border-border hover:border-primary"
                      )}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Qty */}
            <div className="mb-6">
              <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-2">
                Cantidad
              </p>
              <div className="inline-flex items-center rounded-full border border-border">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="h-10 w-10 rounded-l-full hover:bg-accent"
                >
                  −
                </button>
                <span className="w-10 text-center font-medium">{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="h-10 w-10 rounded-r-full hover:bg-accent"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-auto">
              <Button size="lg" onClick={handleAdd}>
                <ShoppingBag className="h-4 w-4" />
                Agregar al carrito
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <Button asChild variant="whatsapp" size="default">
                  <a
                    href={whatsappProductInquiry(product)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <WhatsappIcon size={16} /> Consultar
                  </a>
                </Button>
                <Button variant="outline" size="default" onClick={handleShare}>
                  <Share2 className="h-4 w-4" /> Compartir
                </Button>
              </div>
              <Link
                href={`/producto/${product.slug}`}
                className="text-sm text-center text-muted-foreground hover:text-primary mt-1"
              >
                Ver detalles completos →
              </Link>
            </div>
          </div>
        </div>
      </DialogContent>
      <SizeGuideDialog open={sizeGuideOpen} onOpenChange={setSizeGuideOpen} />
    </Dialog>
  );
}
