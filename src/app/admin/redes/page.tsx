import { Instagram, Facebook, MessageCircle, Music2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AdminTopbar } from "@/components/admin/topbar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AdminSocialPage() {
  const store = await safe(() => prisma.storeProfile.findFirst(), null);

  return (
    <>
      <AdminTopbar title="Redes sociales" />
      <main className="p-6 lg:p-8">
        <div className="rounded-2xl border border-border bg-card shadow-card p-6 max-w-2xl space-y-5">
          <h2 className="font-display text-xl font-semibold">Cuentas conectadas</h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <SocialField icon={MessageCircle} label="WhatsApp (número internacional)" value={store?.whatsapp || ""} />
            <SocialField icon={Instagram} label="Instagram URL" value={store?.instagram || ""} />
            <SocialField icon={Facebook} label="Facebook URL" value={store?.facebook || ""} />
            <SocialField icon={Music2} label="TikTok URL" value={store?.tiktok || ""} />
          </div>

          <p className="text-xs text-muted-foreground">
            Para actualizar las redes, edita las variables en{" "}
            <code className="bg-muted rounded px-1.5 py-0.5">.env</code> o desde
            esta vista (próximamente con guardado en vivo).
          </p>
          <Button disabled>Guardar cambios</Button>
        </div>
      </main>
    </>
  );
}

function SocialField({
  icon: Icon,
  label,
  value
}: { icon: any; label: string; value: string }) {
  return (
    <div className="space-y-1.5">
      <Label className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" /> {label}
      </Label>
      <Input defaultValue={value} placeholder="No configurado" />
    </div>
  );
}

async function safe<T>(fn: () => Promise<T>, fb: T): Promise<T> {
  try { return await fn(); } catch { return fb; }
}
