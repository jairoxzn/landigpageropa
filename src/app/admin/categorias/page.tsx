import Image from "next/image";
import Link from "next/link";
import { Plus, Edit } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AdminTopbar } from "@/components/admin/topbar";
import { Button } from "@/components/ui/button";
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
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">
            {categories.length} categorías en la tienda
          </p>
          <Button asChild>
            <Link href="/admin/categorias/nuevo">
              <Plus className="h-4 w-4" /> Nueva categoría
            </Link>
          </Button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/admin/categorias/${c.id}`}
              className="group rounded-2xl border border-border bg-card shadow-card overflow-hidden hover:-translate-y-0.5 hover:shadow-soft transition-all"
            >
              <div className="relative aspect-[16/9] bg-accent">
                {c.imageUrl && (
                  <Image src={c.imageUrl} alt={c.name} fill className="object-cover" />
                )}
                <div className="absolute top-3 right-3 h-9 w-9 grid place-items-center rounded-full bg-white/90 backdrop-blur opacity-0 group-hover:opacity-100 transition-opacity">
                  <Edit className="h-4 w-4" />
                </div>
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
            </Link>
          ))}
          {categories.length === 0 && (
            <div className="col-span-full text-center py-16 border-2 border-dashed border-border rounded-2xl">
              <p className="text-muted-foreground mb-4">Aún no hay categorías.</p>
              <Button asChild>
                <Link href="/admin/categorias/nuevo">
                  <Plus className="h-4 w-4" /> Crear primera categoría
                </Link>
              </Button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
async function safe<T>(fn: () => Promise<T>, fb: T): Promise<T> {
  try { return await fn(); } catch { return fb; }
}
