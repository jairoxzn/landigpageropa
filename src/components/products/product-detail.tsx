"use client";

import * as React from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
  ShoppingBag,
  Share2,
  Heart,
  Truck,
  RotateCcw,
  ShieldCheck,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn, formatPrice, discountPercent } from "@/lib/utils";
import { whatsappProductInquiry } from "@/lib/whatsapp";
import { useCart } from "@/store/cart-store";
import { WhatsappIcon } from "@/components/common/whatsapp-icon";
import { SizeGuideDialog } from "./size-guide-dialog";

export interface ProductDetailData {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDesc?: string | null;
  price: number;
  compareAt?: number | null;
  coverImage: string;
  images: string[];
  colors: string[];
  sizes: string[];
  rating: number;
  reviewsCount: number;
  isNew: boolean;
  category?: { name: string; slug: string } | null;
}

export function ProductDetail({ product }: { product: ProductDetailData }) {
  const gallery = [product.coverImage, ...product.images.filter((i) => i !== product.coverImage)];
  const [activeImg, setActiveImg] = React.useState(0);
  const [size, setSize] = React.useState<string | undefined>(product.sizes[0]);
  const [color, setColor] = React.useState<string | undefined>(product.colors[0]);
  const [qty, setQty] = React.useState(1);
  const [liked, setLiked] = React.useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = React.useState(false);
  const add = useCart((s) => s.add);
  const off = discountPercent(product.price, product.compareAt ?? undefined);

  const handleAdd = () => {
    add({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.coverImage,
      size,
      color,
      quantity: qty
    });
    toast.success("Agregado al carrito", { description: product.name });
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/producto/${product.slug}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: product.name, url });
        return;
      } catch {}
    }
    await navigator.clipboard.writeText(url);
    toast.success("Enlace copiado");
  };

  return (
    <div className="container-lucia py-10 md:py-16">
      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Gallery */}
        <div>
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-accent shadow-card">
            <Image
              src={gallery[activeImg]}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute top-4 left-4 flex flex-col gap-1.5">
              {product.isNew && <Badge variant="new">Nuevo</Badge>}
              {off > 0 && <Badge variant="sale">-{off}%</Badge>}
            </div>
          </div>
          {gallery.length > 1 && (
            <div className="mt-4 grid grid-cols-5 gap-2">
              {gallery.map((img, i) => (
                <button
                  key={img + i}
                  onClick={() => setActiveImg(i)}
                  className={cn(
                    "relative aspect-square rounded-xl overflow-hidden border-2 transition-all",
                    activeImg === i ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"
                  )}
                >
                  <Image src={img} alt="" fill sizes="100px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          {product.category && (
            <span className="eyebrow mb-2">{product.category.name}</span>
          )}
          <h1 className="heading-md mb-3 text-balance">{product.name}</h1>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-4 w-4",
                    i < Math.round(product.rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted-foreground/30"
                  )}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {product.rating.toFixed(1)} ({product.reviewsCount} reseñas)
            </span>
          </div>

          <div className="flex items-end gap-3 mb-6">
            <span className="font-display text-3xl font-bold">
              {formatPrice(product.price)}
            </span>
            {product.compareAt && product.compareAt > product.price && (
              <>
                <span className="text-lg text-muted-foreground line-through">
                  {formatPrice(product.compareAt)}
                </span>
                <Badge variant="sale" className="ml-1">-{off}% OFF</Badge>
              </>
            )}
          </div>

          <p className="text-muted-foreground mb-7 text-pretty">
            {product.shortDesc || product.description}
          </p>

          {/* Sizes */}
          {product.sizes.length > 0 && (
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs uppercase tracking-wider font-semibold">Talla</p>
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
                      "h-11 min-w-11 px-4 rounded-full text-sm font-medium border transition-all",
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
          {product.colors.length > 0 && (
            <div className="mb-6">
              <p className="text-xs uppercase tracking-wider font-semibold mb-2">Color</p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={cn(
                      "h-11 px-4 rounded-full text-sm border transition-all",
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

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-6">
            <p className="text-xs uppercase tracking-wider font-semibold">Cantidad</p>
            <div className="inline-flex items-center rounded-full border border-border">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="h-11 w-11 rounded-l-full hover:bg-accent"
              >
                −
              </button>
              <span className="w-12 text-center font-medium">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="h-11 w-11 rounded-r-full hover:bg-accent"
              >
                +
              </button>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col gap-3">
            <div className="flex gap-2">
              <Button size="xl" onClick={handleAdd} className="flex-1">
                <ShoppingBag className="h-4 w-4" />
                Agregar al carrito
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="h-14 w-14"
                aria-label="Favorito"
                onClick={() => setLiked((v) => !v)}
              >
                <Heart
                  className={cn(
                    "h-5 w-5",
                    liked ? "fill-primary text-primary" : ""
                  )}
                />
              </Button>
            </div>
            <Button asChild variant="whatsapp" size="lg">
              <a
                href={whatsappProductInquiry(product)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsappIcon size={16} />
                Consultar por WhatsApp
              </a>
            </Button>
            <Button variant="ghost" size="lg" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
              Compartir producto
            </Button>
          </div>

          <Separator className="my-7" />

          {/* Benefits */}
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-3">
              <Truck className="h-4 w-4 text-primary" />
              Envío express 24-72h en todo el Perú
            </li>
            <li className="flex items-center gap-3">
              <RotateCcw className="h-4 w-4 text-primary" />
              Cambios gratis durante 7 días
            </li>
            <li className="flex items-center gap-3">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Pago seguro · Tarjeta, Yape, transferencia
            </li>
          </ul>
        </div>
      </div>

      {/* Description */}
      <section className="mt-16 max-w-3xl">
        <h2 className="heading-md mb-4">Descripción</h2>
        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
          {product.description}
        </p>
      </section>

      <SizeGuideDialog open={sizeGuideOpen} onOpenChange={setSizeGuideOpen} />
    </div>
  );
}
