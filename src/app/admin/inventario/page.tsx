import { prisma } from "@/lib/prisma";
import { AdminTopbar } from "@/components/admin/topbar";
import { InventoryRow } from "@/components/admin/inventory-row";

export const dynamic = "force-dynamic";

export default async function AdminInventoryPage() {
  const items = await safe(
    () =>
      prisma.inventory.findMany({
        include: { product: true },
        orderBy: [{ stock: "asc" }, { product: { name: "asc" } }]
      }),
    []
  );

  const low = items.filter((i) => i.stock <= i.lowStockAt).length;

  return (
    <>
      <AdminTopbar title="Inventario" />
      <main className="p-6 lg:p-8">
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <p className="text-sm text-muted-foreground">
            {items.length} variantes · {low} con stock bajo
          </p>
        </div>
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
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-muted-foreground">
                      No hay variantes en inventario. Crea un producto con tallas para verlas aquí.
                    </td>
                  </tr>
                ) : (
                  items.map((i) => (
                    <InventoryRow
                      key={i.id}
                      id={i.id}
                      productName={i.product.name}
                      productImage={i.product.coverImage}
                      size={i.size}
                      color={i.color}
                      stock={i.stock}
                      lowStockAt={i.lowStockAt}
                    />
                  ))
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
