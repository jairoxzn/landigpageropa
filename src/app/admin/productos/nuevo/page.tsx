import { prisma } from "@/lib/prisma";
import { AdminTopbar } from "@/components/admin/topbar";
import { ProductForm } from "@/components/admin/product-form";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const categories = await safe(
    () => prisma.category.findMany({ orderBy: { order: "asc" } }),
    []
  );
  return (
    <>
      <AdminTopbar title="Nuevo producto" />
      <main className="p-6 lg:p-8">
        <ProductForm categories={categories} />
      </main>
    </>
  );
}
async function safe<T>(fn: () => Promise<T>, fb: T): Promise<T> {
  try { return await fn(); } catch { return fb; }
}
