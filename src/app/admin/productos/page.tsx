import Image from "next/image";
import Link from "next/link";
import { Plus, Edit, ExternalLink } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AdminTopbar } from "@/components/admin/topbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await safe(
    () =>
      prisma.product.findMany({
        include: { category: true, _count: { select: { inventory: true } } },
        orderBy: { createdAt: "desc" }
      }),
    []
  );

  return (
    <>
      <AdminTopbar title="Productos" />
      <main className="p-6 lg:p-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">
            {products.length} productos en catálogo
          </p>
          <Button asChild>
            <Link href="/admin/productos/nuevo">
              <Plus className="h-4 w-4" /> Nuevo producto
            </Link>
          </Button>
        </div>

        <div className="rounded-2xl border border-border bg-card shadow-card overflow-hidden">
          <div className="overflow-x-auto scrollbar-pretty">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold">Producto</th>
                  <th className="px-4 py-3 font-semibold">Categoría</th>
                  <th className="px-4 py-3 font-semibold">Precio</th>
                  <th className="px-4 py-3 font-semibold">Estado</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {products.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted-foreground">
                      Aún no has agregado productos.
                    </td>
                  </tr>
                )}
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-accent shrink-0">
                          <Image src={p.coverImage} alt={p.name} fill sizes="48px" className="object-cover" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium truncate">{p.name}</p>
                          <p className="text-xs text-muted-foreground">{p.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="soft">{p.category?.name || "—"}</Badge>
                    </td>
                    <td className="px-4 py-3 font-semibold">
                      {formatPrice(Number(p.price))}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {p.isActive ? (
                          <Badge variant="soft">Activo</Badge>
                        ) : (
                          <Badge variant="outline">Inactivo</Badge>
                        )}
                        {p.isNew && <Badge variant="new">Nuevo</Badge>}
                        {p.isFeatured && <Badge variant="sale">Destacado</Badge>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex gap-1">
                        <Button asChild variant="ghost" size="icon" aria-label="Ver">
                          <Link href={`/producto/${p.slug}`} target="_blank">
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button asChild variant="ghost" size="icon" aria-label="Editar">
                          <Link href={`/admin/productos/${p.id}`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}

async function safe<T>(fn: () => Promise<T>, fb: T): Promise<T> {
  try { return await fn(); } catch { return fb; }
}
