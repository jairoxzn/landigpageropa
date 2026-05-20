import { prisma } from "@/lib/prisma";
import { AdminTopbar } from "@/components/admin/topbar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const store = await safe(() => prisma.storeProfile.findFirst(), null);

  return (
    <>
      <AdminTopbar title="Configuración" />
      <main className="p-6 lg:p-8 space-y-6 max-w-3xl">
        <section className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-5">
          <h2 className="font-display text-lg font-semibold">Información general</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Nombre de la tienda</Label>
              <Input defaultValue={store?.storeName || "Lucia Jeans"} />
            </div>
            <div className="space-y-1.5">
              <Label>Tagline</Label>
              <Input defaultValue={store?.tagline || ""} />
            </div>
            <div className="space-y-1.5">
              <Label>Email contacto</Label>
              <Input defaultValue={store?.email || ""} />
            </div>
            <div className="space-y-1.5">
              <Label>Teléfono</Label>
              <Input defaultValue={store?.phone || ""} />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Dirección</Label>
              <Input defaultValue={store?.address || ""} />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Acerca de</Label>
              <Textarea rows={4} defaultValue={store?.about || ""} />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-5">
          <h2 className="font-display text-lg font-semibold">Moneda y envío</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Moneda</Label>
              <Input defaultValue={store?.currency || "PEN"} />
            </div>
            <div className="space-y-1.5">
              <Label>Nota de envío</Label>
              <Input defaultValue={store?.shippingNote || "Envío gratis > S/199"} />
            </div>
          </div>
        </section>

        <Button>Guardar cambios</Button>
      </main>
    </>
  );
}

async function safe<T>(fn: () => Promise<T>, fb: T): Promise<T> {
  try { return await fn(); } catch { return fb; }
}
