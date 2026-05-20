import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { AdminTopbar } from "@/components/admin/topbar";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminInventoryPage() {
  const items = await safe(
    () =>
      prisma.inventory.findMany({
        include: { product: true },
        orderBy: { stock: "asc" }
      }),
    []
  );

  return (
    <>
      <AdminTopbar title="Inventario" />
      <main className="p-6 lg:p-8">
        <p className="text-sm text-muted-foreground mb-6">
          {items.length} variantes en inventario
        </p>
        <div className="rounded-2xl border border-border bg-card shadow-card overflow-hidden">
          <div className="overflow-x-auto scrollbar-pretty">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold">Producto</th>
                  <th className="px-4 py-3 font-semibold">Talla</th>
                  <th className="px-4 py-3 font-semibold">Color</th>
                  <th className="px-4 py-3 font-semibold">Stock</th>
                  <th className="px-4 py-3 font-semibold">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map((i) => (
                  <tr key={i.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 rounded-xl overflow-hidden bg-accent">
                          <Image
                            src={i.product.coverImage}
                            alt={i.product.name}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        </div>
                        <span className="font-medium">{i.product.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">{i.size}</td>
                    <td className="px-4 py-3">{i.color || "—"}</td>
                    <td className="px-4 py-3 font-semibold">{i.stock}</td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
                          i.stock === 0
                            ? "bg-red-100 text-red-700"
                            : i.stock <= i.lowStockAt
                            ? "bg-amber-100 text-amber-700"
                            : "bg-emerald-100 text-emerald-700"
                        )}
                      >
                        {i.stock === 0 ? "Agotado" : i.stock <= i.lowStockAt ? "Stock bajo" : "Disponible"}
                      </span>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted-foreground">
                      No hay variantes en inventario.
                    </td>
                  </tr>
                )}
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
