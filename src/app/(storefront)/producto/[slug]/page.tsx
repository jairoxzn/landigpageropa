import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/products/product-detail";
import { getProductBySlug } from "@/lib/queries";

export const revalidate = 120;

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const p = await getProductBySlug(params.slug);
    if (!p) return { title: "Producto" };
    return {
      title: p.name,
      description: p.shortDesc || p.description.slice(0, 160),
      openGraph: {
        title: p.name,
        description: p.shortDesc || p.description.slice(0, 160),
        images: [{ url: p.coverImage }]
      }
    };
  } catch {
    return { title: "Producto" };
  }
}

export default async function ProductPage({ params }: Props) {
  let product;
  try {
    product = await getProductBySlug(params.slug);
  } catch {
    product = null;
  }
  if (!product) notFound();

  return <ProductDetail product={product} />;
}
