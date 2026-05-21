import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminTopbar } from "@/components/admin/topbar";
import { CategoryForm } from "@/components/admin/category-form";

export const dynamic = "force-dynamic";

export default async function EditCategoryPage({
  params
}: {
  params: { id: string };
}) {
  const category = await prisma.category
    .findUnique({ where: { id: params.id } })
    .catch(() => null);

  if (!category) notFound();

  return (
    <>
      <AdminTopbar title={`Editar · ${category.name}`} />
      <main className="p-6 lg:p-8">
        <CategoryForm
          category={{
            id: category.id,
            name: category.name,
            slug: category.slug,
            description: category.description || "",
            imageUrl: category.imageUrl || "",
            isFeatured: category.isFeatured,
            isActive: category.isActive,
            order: category.order
          }}
        />
      </main>
    </>
  );
}
