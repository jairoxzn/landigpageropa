import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminTopbar } from "@/components/admin/topbar";
import { ProductForm } from "@/components/admin/product-form";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params
}: {
  params: { id: string };
}) {
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id: params.id } }).catch(() => null),
    prisma.category.findMany({ orderBy: { order: "asc" } }).catch(() => [])
  ]);

  if (!product) notFound();

  return (
    <>
      <AdminTopbar title={`Editar · ${product.name}`} />
      <main className="p-6 lg:p-8">
        <ProductForm
          categories={categories}
          product={{
            id: product.id,
            name: product.name,
            slug: product.slug,
            sku: product.sku || "",
            description: product.description,
            shortDesc: product.shortDesc || "",
            price: Number(product.price),
            compareAt: product.compareAt ? Number(product.compareAt) : undefined,
            coverImage: product.coverImage,
            images: product.images,
            colors: product.colors,
            sizes: product.sizes,
            categoryId: product.categoryId,
            isNew: product.isNew,
            isFeatured: product.isFeatured,
            isActive: product.isActive
          }}
        />
      </main>
    </>
  );
}
