"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, formatPrice, discountPercent } from "@/lib/utils";
import { whatsappProductInquiry } from "@/lib/whatsapp";
import { WhatsappIcon } from "@/components/common/whatsapp-icon";
import { QuickView } from "./quick-view";

export interface ProductCardData {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAt?: number | null;
  coverImage: string;
  images?: string[];
  colors?: string[];
  sizes?: string[];
  isNew?: boolean;
  isFeatured?: boolean;
  description?: string;
  shortDesc?: string | null;
  rating?: number;
  category?: { name: string; slug: string } | null;
}

interface Props {
  product: ProductCardData;
  className?: string;
  priority?: boolean;
}

export function ProductCard({ product, className, priority = false }: Props) {
  const [quickOpen, setQuickOpen] = React.useState(false);
  const [liked, setLiked] = React.useState(false);
  const off = discountPercent(product.price, product.compareAt ?? undefined);

  const hoverImg = product.images?.[1] || product.coverImage;

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/producto/${product.slug}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.shortDesc || product.name,
          url
        });
      } catch {}
    } else {
      navigator.clipboard.writeText(url);
    }
  };

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.45 }}
        className={cn("card-premium group flex flex-col", className)}
      >
        <Link href={`/producto/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden">
          <Image
            src={product.coverImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={priority}
            className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:opacity-0"
          />
          <Image
            src={hoverImg}
            alt=""
            aria-hidden
            fill
            sizes="(max-width: 640px) 50vw, 25vw"
            className="object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.isNew && <Badge variant="new">Nuevo</Badge>}
            {off > 0 && <Badge variant="sale">-{off}%</Badge>}
          </div>

          {/* Like */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setLiked((v) => !v);
            }}
            aria-label="Favorito"
            className="absolute top-3 right-3 h-9 w-9 grid place-items-center rounded-full bg-white/80 backdrop-blur hover:bg-white transition"
          >
            <Heart
              className={cn(
                "h-4 w-4 transition-colors",
                liked ? "fill-primary text-primary" : "text-foreground"
              )}
            />
          </button>

          {/* Hover actions */}
          <div className="absolute bottom-3 inset-x-3 flex items-center justify-between gap-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
            <Button
              size="sm"
              variant="default"
              onClick={(e) => {
                e.preventDefault();
                setQuickOpen(true);
              }}
              className="flex-1"
            >
              <Eye className="h-4 w-4" /> Vista rápida
            </Button>
            <Button
              size="icon"
              variant="dark"
              asChild
              className="h-9 w-9"
              aria-label="Compartir"
            >
              <a onClick={handleShare}>
                <Share2 className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </Link>

        {/* Info */}
        <div className="p-4 flex flex-col gap-2 flex-1">
          {product.category && (
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
              {product.category.name}
            </p>
          )}
          <Link
            href={`/producto/${product.slug}`}
            className="font-medium hover:text-primary transition-colors line-clamp-2 leading-snug"
          >
            {product.name}
          </Link>
          <div className="flex items-center gap-2 mt-auto pt-2">
            <span className="font-display text-lg font-bold">
              {formatPrice(product.price)}
            </span>
            {product.compareAt && product.compareAt > product.price && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.compareAt)}
              </span>
            )}
          </div>

          <Button
            asChild
            variant="whatsapp"
            size="sm"
            className="mt-2 w-full"
          >
            <a
              href={whatsappProductInquiry(product)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsappIcon size={16} /> Consultar
            </a>
          </Button>
        </div>
      </motion.article>

      <QuickView product={product} open={quickOpen} onOpenChange={setQuickOpen} />
    </>
  );
}
