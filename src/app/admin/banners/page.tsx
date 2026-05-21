import Image from "next/image";
import Link from "next/link";
import { Plus, Edit } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AdminTopbar } from "@/components/admin/topbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function AdminBannersPage() {
  const banners = await safe(
    () => prisma.banner.findMany({ orderBy: [{ position: "asc" }, { order: "asc" }] }),
    []
  );

  return (
    <>
      <AdminTopbar title="Banners" />
      <main className="p-6 lg:p-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">{banners.length} banners</p>
          <Button asChild>
            <Link href="/admin/banners/nuevo">
              <Plus className="h-4 w-4" /> Nuevo banner
            </Link>
          </Button>
        </div>

        <div className="space-y-4">
          {banners.map((b) => (
            <Link
              key={b.id}
              href={`/admin/banners/${b.id}`}
              className="block rounded-2xl border border-border bg-card shadow-card overflow-hidden grid md:grid-cols-[280px_1fr] gap-4 hover:shadow-soft transition-shadow group"
            >
              <div className="relative aspect-[16/9] md:aspect-auto bg-accent">
                <Image src={b.imageUrl} alt={b.title} fill className="object-cover" />
                <div className="absolute top-3 right-3 h-9 w-9 grid place-items-center rounded-full bg-white/90 backdrop-blur opacity-0 group-hover:opacity-100 transition-opacity">
                  <Edit className="h-4 w-4" />
                </div>
              </div>
              <div className="p-5 flex flex-col justify-center">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <Badge variant="soft">{b.position}</Badge>
                  {b.isActive ? (
                    <Badge variant="default">Activo</Badge>
                  ) : (
                    <Badge variant="outline">Inactivo</Badge>
                  )}
                </div>
                <h3 className="font-display text-xl font-semibold">{b.title}</h3>
                <p className="text-sm text-muted-foreground">{b.subtitle}</p>
                {b.ctaUrl && (
                  <p className="mt-2 text-xs text-primary">
                    {b.ctaLabel} → {b.ctaUrl}
                  </p>
                )}
              </div>
            </Link>
          ))}
          {banners.length === 0 && (
            <div className="text-center py-16 border-2 border-dashed border-border rounded-2xl">
              <p className="text-muted-foreground mb-4">Aún no hay banners.</p>
              <Button asChild>
                <Link href="/admin/banners/nuevo">
                  <Plus className="h-4 w-4" /> Crear primer banner
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
