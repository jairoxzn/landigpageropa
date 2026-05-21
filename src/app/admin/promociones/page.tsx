import Link from "next/link";
import { Plus, Edit } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AdminTopbar } from "@/components/admin/topbar";
import { Button } from "@/components/ui/button";
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
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">{promos.length} promociones</p>
          <Button asChild>
            <Link href="/admin/promociones/nuevo">
              <Plus className="h-4 w-4" /> Nueva promoción
            </Link>
          </Button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {promos.map((p) => (
            <Link
              key={p.id}
              href={`/admin/promociones/${p.id}`}
              className="group relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary to-pink-500 text-white p-6 shadow-card hover:-translate-y-0.5 transition-transform"
            >
              <div className="absolute -top-12 -right-8 h-32 w-32 rounded-full bg-white/15 blur-2xl" />
              <div className="absolute top-3 right-3 h-9 w-9 grid place-items-center rounded-full bg-white/20 backdrop-blur opacity-0 group-hover:opacity-100 transition-opacity">
                <Edit className="h-4 w-4 text-white" />
              </div>
              <Badge variant="outline" className="bg-black/30 backdrop-blur border-white/20 text-white mb-4">
                {p.type}
              </Badge>
              <h3 className="font-display text-2xl font-bold mb-2">{p.name}</h3>
              <p className="text-sm opacity-90 mb-4 line-clamp-2">{p.description}</p>
              {p.code && (
                <div className="font-mono text-base bg-black/30 backdrop-blur rounded-lg px-3 py-2 mb-4 inline-block">
                  {p.code}
                </div>
              )}
              <p className="text-xs opacity-80">
                {formatDate(p.startsAt)} → {formatDate(p.endsAt)}
              </p>
              {!p.isActive && (
                <span className="absolute bottom-3 right-3 bg-black/30 backdrop-blur text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full">
                  Inactiva
                </span>
              )}
            </Link>
          ))}
          {promos.length === 0 && (
            <div className="col-span-full text-center py-16 border-2 border-dashed border-border rounded-2xl">
              <p className="text-muted-foreground mb-4">Aún no hay promociones.</p>
              <Button asChild>
                <Link href="/admin/promociones/nuevo">
                  <Plus className="h-4 w-4" /> Crear primera promoción
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
