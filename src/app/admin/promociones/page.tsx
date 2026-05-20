import { prisma } from "@/lib/prisma";
import { AdminTopbar } from "@/components/admin/topbar";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminPromotionsPage() {
  const promos = await safe(
    () => prisma.promotion.findMany({ orderBy: { createdAt: "desc" } }),
    []
  );

  return (
    <>
      <AdminTopbar title="Promociones" />
      <main className="p-6 lg:p-8">
        <p className="text-sm text-muted-foreground mb-6">{promos.length} promociones</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {promos.map((p) => (
            <article
              key={p.id}
              className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary to-pink-500 text-white p-6 shadow-card"
            >
              <div className="absolute -top-12 -right-8 h-32 w-32 rounded-full bg-white/15 blur-2xl" />
              <Badge variant="dark" className="bg-black/30 backdrop-blur mb-4">
                {p.type}
              </Badge>
              <h3 className="font-display text-2xl font-bold mb-2">{p.name}</h3>
              <p className="text-sm opacity-90 mb-4">{p.description}</p>
              {p.code && (
                <div className="font-mono text-base bg-black/30 backdrop-blur rounded-lg px-3 py-2 mb-4 inline-block">
                  {p.code}
                </div>
              )}
              <p className="text-xs opacity-80">
                {formatDate(p.startsAt)} → {formatDate(p.endsAt)}
              </p>
            </article>
          ))}
          {promos.length === 0 && (
            <p className="text-muted-foreground col-span-full text-center py-10">
              Aún no hay promociones.
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
