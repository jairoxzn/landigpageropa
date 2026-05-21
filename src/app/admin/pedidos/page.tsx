import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AdminTopbar } from "@/components/admin/topbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate, formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

const statusColors: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  PAID: "bg-emerald-100 text-emerald-700",
  SHIPPED: "bg-violet-100 text-violet-700",
  DELIVERED: "bg-emerald-100 text-emerald-700",
  CANCELLED: "bg-red-100 text-red-700",
  REFUNDED: "bg-zinc-100 text-zinc-700"
};

export default async function AdminOrdersPage() {
  const orders = await safe(
    () =>
      prisma.order.findMany({
        include: { customer: true, _count: { select: { items: true } } },
        orderBy: { createdAt: "desc" }
      }),
    []
  );

  return (
    <>
      <AdminTopbar title="Pedidos" />
      <main className="p-6 lg:p-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">{orders.length} pedidos</p>
          <Button asChild>
            <Link href="/admin/pedidos/nuevo">
              <Plus className="h-4 w-4" /> Nuevo pedido
            </Link>
          </Button>
        </div>
        <div className="rounded-2xl border border-border bg-card shadow-card overflow-hidden">
          <div className="overflow-x-auto scrollbar-pretty">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold">Número</th>
                  <th className="px-4 py-3 font-semibold">Cliente</th>
                  <th className="px-4 py-3 font-semibold">Canal</th>
                  <th className="px-4 py-3 font-semibold">Ítems</th>
                  <th className="px-4 py-3 font-semibold">Total</th>
                  <th className="px-4 py-3 font-semibold">Estado</th>
                  <th className="px-4 py-3 font-semibold">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-muted-foreground">
                      Aún no hay pedidos.
                    </td>
                  </tr>
                ) : (
                  orders.map((o) => (
                    <tr key={o.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3 font-mono text-xs">
                        <Link href={`/admin/pedidos/${o.id}`} className="link-underline">
                          {o.number}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium">{o.customer?.fullName}</p>
                        <p className="text-xs text-muted-foreground">{o.customer?.phone}</p>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline">{o.channel}</Badge>
                      </td>
                      <td className="px-4 py-3">{o._count.items}</td>
                      <td className="px-4 py-3 font-semibold">{formatPrice(Number(o.total))}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                            statusColors[o.status] || "bg-zinc-100 text-zinc-700"
                          }`}
                        >
                          {o.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {formatDate(o.createdAt)}
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
