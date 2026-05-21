import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, Phone, MapPin, ShoppingCart } from "lucide-react";
import { WhatsappIcon } from "@/components/common/whatsapp-icon";
import { prisma } from "@/lib/prisma";
import { AdminTopbar } from "@/components/admin/topbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatPrice } from "@/lib/utils";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

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

export default async function CustomerDetailPage({
  params
}: {
  params: { id: string };
}) {
  const customer = await prisma.customer
    .findUnique({
      where: { id: params.id },
      include: {
        orders: {
          orderBy: { createdAt: "desc" },
          include: { _count: { select: { items: true } } }
        }
      }
    })
    .catch(() => null);

  if (!customer) notFound();

  return (
    <>
      <AdminTopbar title={customer.fullName} />
      <main className="p-6 lg:p-8">
        <Button asChild variant="ghost" size="sm" className="mb-6">
          <Link href="/admin/clientes">
            <ArrowLeft className="h-4 w-4" /> Volver
          </Link>
        </Button>

        <div className="grid lg:grid-cols-3 gap-6">
          <aside className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-card text-center">
              <div className="h-20 w-20 mx-auto rounded-full bg-primary/15 text-primary grid place-items-center text-3xl font-bold font-display mb-4">
                {customer.fullName.charAt(0).toUpperCase()}
              </div>
              <h2 className="font-display text-xl font-bold">{customer.fullName}</h2>
              {customer.city && <p className="text-sm text-muted-foreground">{customer.city}, {customer.country}</p>}
              <ul className="mt-4 space-y-2 text-sm text-left">
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" /> {customer.phone}
                </li>
                {customer.email && (
                  <li className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary" /> {customer.email}
                  </li>
                )}
                {customer.address && (
                  <li className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" /> {customer.address}
                  </li>
                )}
              </ul>
              <Button asChild variant="whatsapp" size="sm" className="w-full mt-4">
                <a
                  href={buildWhatsAppUrl(
                    `¡Hola ${customer.fullName}! 💖 Te escribimos de Lucia Jeans.`,
                    customer.phone.replace(/\D/g, "")
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <WhatsappIcon size={16} /> WhatsApp
                </a>
              </Button>
            </div>

            <div className="rounded-2xl border border-border bg-gradient-to-br from-primary to-pink-500 text-white p-6 shadow-card">
              <p className="text-xs uppercase tracking-wider opacity-80">Total comprado</p>
              <p className="font-display text-3xl font-bold mt-1">
                {formatPrice(Number(customer.totalSpent))}
              </p>
              <p className="text-sm opacity-90 mt-2">
                {customer.ordersCount} {customer.ordersCount === 1 ? "pedido" : "pedidos"}
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-card text-xs text-muted-foreground space-y-1">
              <p>Cliente desde {formatDate(customer.createdAt)}</p>
              {customer.notes && (
                <>
                  <p className="text-foreground font-medium mt-2 mb-1">Notas:</p>
                  <p className="whitespace-pre-line">{customer.notes}</p>
                </>
              )}
            </div>
          </aside>

          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-border bg-card shadow-card overflow-hidden">
              <div className="p-5 border-b border-border flex items-center gap-2">
                <ShoppingCart className="h-4 w-4 text-primary" />
                <h3 className="font-display text-lg font-semibold">Historial de pedidos</h3>
              </div>
              <div className="divide-y divide-border">
                {customer.orders.length === 0 ? (
                  <p className="p-6 text-center text-muted-foreground text-sm">
                    Este cliente aún no tiene pedidos.
                  </p>
                ) : (
                  customer.orders.map((o) => (
                    <Link
                      key={o.id}
                      href={`/admin/pedidos/${o.id}`}
                      className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
                    >
                      <div>
                        <p className="font-mono text-sm">{o.number}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(o.createdAt)} · {o._count.items} ítems
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                            statusColors[o.status]
                          }`}
                        >
                          {o.status}
                        </span>
                        <span className="font-semibold">{formatPrice(Number(o.total))}</span>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
