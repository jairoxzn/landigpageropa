"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ProductGrid } from "@/components/products/product-grid";
import type { ProductCardData } from "@/components/products/product-card";

interface Props {
  products: ProductCardData[];
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  href?: string;
  cta?: string;
}

export function FeaturedProducts({
  products,
  eyebrow = "Lo más vendido",
  title = "Productos destacados",
  subtitle = "Las prendas favoritas de la comunidad Lucia.",
  href = "/catalogo",
  cta = "Ver todo el catálogo"
}: Props) {
  return (
    <section className="section">
      <div className="container-lucia">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <span className="eyebrow mb-3">{eyebrow}</span>
            <h2 className="heading-lg mb-3 text-balance">{title}</h2>
            <p className="text-muted-foreground max-w-xl">{subtitle}</p>
          </div>
          <Link
            href={href}
            className="inline-flex items-center gap-2 text-sm font-medium link-underline"
          >
            {cta} <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <ProductGrid products={products.slice(0, 8)} />
      </div>
    </section>
  );
}
