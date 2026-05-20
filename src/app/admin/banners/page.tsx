import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { AdminTopbar } from "@/components/admin/topbar";
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
        <p className="text-sm text-muted-foreground mb-6">{banners.length} banners</p>
        <div className="space-y-4">
          {banners.map((b) => (
            <article
              key={b.id}
              className="rounded-2xl border border-border bg-card shadow-card overflow-hidden grid md:grid-cols-[280px_1fr] gap-4"
            >
              <div className="relative aspect-[16/9] md:aspect-auto bg-accent">
                <Image src={b.imageUrl} alt={b.title} fill className="object-cover" />
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
            </article>
          ))}
          {banners.length === 0 && (
            <p className="text-muted-foreground text-center py-10">
              Aún no hay banners.
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
