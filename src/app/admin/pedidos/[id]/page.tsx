import Link from "next/link";
import { notFound } from "next/navigation";
import { Mail, Phone, MapPin, ArrowLeft } from "lucide-react";
import { WhatsappIcon } from "@/components/common/whatsapp-icon";
import { prisma } from "@/lib/prisma";
import { AdminTopbar } from "@/components/admin/topbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OrderStatusControl } from "@/components/admin/order-status-control";
import { formatDate, formatPrice } from "@/lib/utils";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

export default async function OrderDetailPage({
  params
}: {
  params: { id: string };
}) {
  const order = await prisma.order
    .findUnique({
      where: { id: params.id },
      include: { items: true, customer: true }
    })
    .catch(() => null);

  if (!order) notFound();

  const wamsg = `¡Hola ${order.customer.fullName}! Te escribimos de Lucia Jeans sobre tu pedido *${order.number}*.`;

  return (
    <>
      <AdminTopbar title={`Pedido ${order.number}`} />
      <main className="p-6 lg:p-8">
        <Button asChild variant="ghost" size="sm" className="mb-6">
          <Link href="/admin/pedidos">
            <ArrowLeft className="h-4 w-4" /> Volver a pedidos
          </Link>
        </Button>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Items + summary */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-lg font-semibold">Items del pedido</h3>
                <Badge variant="outline">{order.channel}</Badge>
              </div>
              <table className="w-full text-sm">
                <thead className="text-left text-muted-foreground border-b">
                  <tr>
                    <th className="pb-2 font-medium">Producto</th>
                    <th className="pb-2 font-medium">Talla</th>
                    <th className="pb-2 font-medium">Color</th>
                    <th className="pb-2 font-medium text-right">Cant.</th>
                    <th className="pb-2 font-medium text-right">Precio</th>
                    <th className="pb-2 font-medium text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {order.items.map((i) => (
                    <tr key={i.id}>
                      <td className="py-3">{i.name}</td>
                      <td className="py-3">{i.size || "—"}</td>
                      <td className="py-3">{i.color || "—"}</td>
                      <td className="py-3 text-right">{i.quantity}</td>
                      <td className="py-3 text-right">{formatPrice(Number(i.unitPrice))}</td>
                      <td className="py-3 text-right font-semibold">
                        {formatPrice(Number(i.subtotal))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-6 pt-6 border-t border-border space-y-2 max-w-xs ml-auto">
                <Row label="Subtotal" value={formatPrice(Number(order.subtotal))} />
                <Row label="Descuento" value={`- ${formatPrice(Number(order.discount))}`} />
                <Row label="Envío" value={formatPrice(Number(order.shipping))} />
                <div className="border-t border-border pt-2">
                  <Row label="Total" value={formatPrice(Number(order.total))} bold />
                </div>
              </div>
            </div>

            {order.notes && (
              <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
                <h3 className="font-display text-lg font-semibold mb-2">Notas internas</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-line">{order.notes}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <h3 className="font-display text-lg font-semibold mb-3">Cliente</h3>
              <p className="font-semibold mb-2">{order.customer.fullName}</p>
              <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" /> {order.customer.phone}
                </li>
                {order.customer.email && (
                  <li className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary" /> {order.customer.email}
                  </li>
                )}
                {order.customer.address && (
                  <li className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" /> {order.customer.address}
                  </li>
                )}
              </ul>
              <Button asChild variant="whatsapp" size="sm" className="w-full">
                <a
                  href={buildWhatsAppUrl(wamsg, order.customer.phone.replace(/\D/g, ""))}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <WhatsappIcon size={16} /> Escribir por WhatsApp
                </a>
              </Button>
            </div>

            <OrderStatusControl
              orderId={order.id}
              status={order.status}
              trackingCode={order.trackingCode}
              notes={order.notes}
            />

            <div className="rounded-2xl border border-border bg-card p-6 shadow-card text-xs space-y-1 text-muted-foreground">
              <p>Creado: {formatDate(order.createdAt)}</p>
              <p>Actualizado: {formatDate(order.updatedAt)}</p>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between text-sm ${bold ? "text-lg font-display font-bold" : ""}`}>
      <span className="text-muted-foreground">{label}</span>
      <span>{value}</span>
    </div>
  );
}
