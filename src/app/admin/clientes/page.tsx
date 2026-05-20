import { prisma } from "@/lib/prisma";
import { AdminTopbar } from "@/components/admin/topbar";
import { formatPrice, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  const customers = await safe(
    () => prisma.customer.findMany({ orderBy: { createdAt: "desc" }, take: 200 }),
    []
  );

  return (
    <>
      <AdminTopbar title="Clientes" />
      <main className="p-6 lg:p-8">
        <p className="text-sm text-muted-foreground mb-6">{customers.length} clientes registrados</p>
        <div className="rounded-2xl border border-border bg-card shadow-card overflow-hidden">
          <div className="overflow-x-auto scrollbar-pretty">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold">Cliente</th>
                  <th className="px-4 py-3 font-semibold">Teléfono</th>
                  <th className="px-4 py-3 font-semibold">Pedidos</th>
                  <th className="px-4 py-3 font-semibold">Gasto total</th>
                  <th className="px-4 py-3 font-semibold">Registro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {customers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted-foreground">
                      Aún no hay clientes registrados.
                    </td>
                  </tr>
                ) : (
                  customers.map((c) => (
                    <tr key={c.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-primary/15 text-primary grid place-items-center font-semibold text-sm">
                            {c.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium">{c.fullName}</p>
                            <p className="text-xs text-muted-foreground">{c.email || "—"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">{c.phone}</td>
                      <td className="px-4 py-3">{c.ordersCount}</td>
                      <td className="px-4 py-3 font-semibold">
                        {formatPrice(Number(c.totalSpent))}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {formatDate(c.createdAt)}
                      </td>
                    </tr>
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
