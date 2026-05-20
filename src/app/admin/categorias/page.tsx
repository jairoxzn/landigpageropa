import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { AdminTopbar } from "@/components/admin/topbar";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await safe(
    () =>
      prisma.category.findMany({
        include: { _count: { select: { products: true } } },
        orderBy: { order: "asc" }
      }),
    []
  );

  return (
    <>
      <AdminTopbar title="Categorías" />
      <main className="p-6 lg:p-8">
        <p className="text-sm text-muted-foreground mb-6">
          {categories.length} categorías en la tienda
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((c) => (
            <article
              key={c.id}
              className="rounded-2xl border border-border bg-card shadow-card overflow-hidden hover:-translate-y-0.5 transition-transform"
            >
              <div className="relative aspect-[16/9] bg-accent">
                {c.imageUrl && (
                  <Image src={c.imageUrl} alt={c.name} fill className="object-cover" />
                )}
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-display text-lg font-semibold">{c.name}</h3>
                  {c.isFeatured && <Badge variant="sale">Destacada</Badge>}
                </div>
                <p className="text-xs text-muted-foreground mb-4 line-clamp-2 min-h-[2.5rem]">
                  {c.description}
                </p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">/{c.slug}</span>
                  <span className="font-semibold text-primary">
                    {c._count.products} productos
                  </span>
                </div>
              </div>
            </article>
          ))}
          {categories.length === 0 && (
            <p className="text-muted-foreground col-span-full text-center py-10">
              Aún no hay categorías.
            </p>
          )}
        </div>
      </main>
    </>
  );
}
async function safe<T>(fn: () => Promise<T>, fb: T): Promise<T> {
  try { return await fn(); } catch { return fb; }
}
