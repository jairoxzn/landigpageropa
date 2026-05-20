import { ProductCard, type ProductCardData } from "./product-card";
import { cn } from "@/lib/utils";

interface Props {
  products: ProductCardData[];
  className?: string;
  cols?: 2 | 3 | 4;
}

export function ProductGrid({ products, className, cols = 4 }: Props) {
  const grid =
    cols === 2
      ? "grid-cols-2"
      : cols === 3
      ? "grid-cols-2 md:grid-cols-3"
      : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4";

  return (
    <div className={cn("grid gap-5 md:gap-6", grid, className)}>
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} priority={i < 4} />
      ))}
    </div>
  );
}
