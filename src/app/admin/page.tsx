import {
  Package,
  ShoppingCart,
  Users,
  CreditCard,
  Clock,
  ArrowUpRight
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { AdminTopbar } from "@/components/admin/topbar";
import { StatCard } from "@/components/admin/stat-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [productsCount, ordersCount, customersCount, recentOrders, lowStock, revenue] =
    await Promise.all([
      safe(() => prisma.product.count(), 0),
      safe(() => prisma.order.count(), 0),
      safe(() => prisma.customer.count(), 0),
      safe(
        () =>
          prisma.order.findMany({
            take: 5,
            orderBy: { createdAt: "desc" },
            include: { customer: true }
          }),
        []
      ),
      safe(
        () =>
          prisma.inventory.findMany({
            take: 5,
            where: { stock: { lte: 5 } },
            orderBy: { stock: "asc" },
            include: { product: { select: { name: true, coverImage: true, slug: true } } }
          }),
        []
      ),
      safe(
        () =>
          prisma.order
            .aggregate({
              _sum: { total: true },
              where: { status: { in: ["PAID", "DELIVERED", "SHIPPED"] } }
            })
            .then((r) => Number(r._sum.total || 0)),
        0
      )
    ]);

  return (
    <>
      <AdminTopbar title="Dashboard" />
      <main className="p-6 lg:p-8 space-y-8">
        {/* Stats */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard label="Ingresos" value={formatPrice(revenue)} delta={12} icon={CreditCard} accent="pink" />
          <StatCard label="Pedidos" value={ordersCount} delta={8} icon={ShoppingCart} accent="violet" />
          <StatCard label="Productos" value={productsCount} icon={Package} accent="black" />
          <StatCard label="Clientes" value={customersCount} delta={4} icon={Users} accent="amber" />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent orders */}
          <div className="lg:col-span-2 rounded-2xl border border-border bg-card shadow-card">
            <div className="p-5 flex items-center justify-between border-b border-border">
              <div>
                <h2 className="font-display text-lg font-semibold">Pedidos recientes</h2>
                <p className="text-xs text-muted-foreground">Últimos 5 pedidos</p>
              </div>
              <Button asChild variant="ghost" size="sm">
                <Link href="/admin/pedidos">
                  Ver todos <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="divide-y divide-border">
              {recentOrders.length === 0 ? (
                <p className="p-6 text-sm text-muted-foreground text-center">
                  Aún no hay pedidos.
                </p>
              ) : (
                recentOrders.map((o) => (
                  <Link
                    key={o.id}
                    href={`/admin/pedidos/${o.id}`}
                    className="flex items-center justify-between gap-3 p-4 hover:bg-muted/40 transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-sm">{o.number}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {o.customer?.fullName} · {formatDate(o.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="soft" className="hidden sm:inline-flex">
                        {o.status}
                      </Badge>
                      <span className="font-semibold text-sm">
                        {formatPrice(Number(o.total))}
                      </span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Low stock */}
          <div className="rounded-2xl border border-border bg-card shadow-card">
            <div className="p-5 border-b border-border">
              <h2 className="font-display text-lg font-semibold flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                Stock bajo
              </h2>
              <p className="text-xs text-muted-foreground">Reabastecer pronto</p>
            </div>
            <div className="divide-y divide-border">
              {lowStock.length === 0 ? (
                <p className="p-6 text-sm text-muted-foreground text-center">
                  Todo el stock está saludable 💖
                </p>
              ) : (
                lowStock.map((i) => (
                  <div key={i.id} className="flex items-center gap-3 p-4">
                    <div className="relative h-11 w-11 rounded-xl overflow-hidden bg-accent">
                      <Image
                        src={i.product.coverImage}
                        alt={i.product.name}
                        fill
                        sizes="44px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm truncate">{i.product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Talla {i.size} {i.color ? `· ${i.color}` : ""}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-red-500">
                      {i.stock} u.
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

async function safe<T>(fn: () => Promise<T>, fb: T): Promise<T> {
  try { return await fn(); } catch { return fb; }
}
