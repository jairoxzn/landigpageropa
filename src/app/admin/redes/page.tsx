import { prisma } from "@/lib/prisma";
import { AdminTopbar } from "@/components/admin/topbar";
import { StoreProfileForm } from "@/components/admin/store-profile-form";

export const dynamic = "force-dynamic";

export default async function AdminSocialPage() {
  const store = await safe(() => prisma.storeProfile.findFirst(), null);

  const initial = {
    whatsapp: store?.whatsapp || "",
    instagram: store?.instagram || "",
    facebook: store?.facebook || "",
    tiktok: store?.tiktok || ""
  };

  return (
    <>
      <AdminTopbar title="Redes sociales" />
      <main className="p-6 lg:p-8">
        <p className="text-sm text-muted-foreground mb-6 max-w-2xl">
          Estas redes aparecen en la navbar, footer, botón flotante de WhatsApp y
          mensajes de compartir catálogo. Guarda para sincronizarlas en toda la tienda.
        </p>
        <StoreProfileForm
          initial={initial}
          sections={[
            {
              title: "Cuentas conectadas",
              fields: [
                {
                  key: "whatsapp",
                  label: "WhatsApp (número internacional)",
                  placeholder: "51999999999 (sin + ni espacios)"
                },
                {
                  key: "instagram",
                  label: "Instagram URL",
                  placeholder: "https://instagram.com/luciajeans"
                },
                {
                  key: "facebook",
                  label: "Facebook URL",
                  placeholder: "https://facebook.com/luciajeans"
                },
                {
                  key: "tiktok",
                  label: "TikTok URL",
                  placeholder: "https://tiktok.com/@luciajeans"
                }
              ]
            }
          ]}
        />
      </main>
    </>
  );
}
async function safe<T>(fn: () => Promise<T>, fb: T): Promise<T> {
  try { return await fn(); } catch { return fb; }
}
