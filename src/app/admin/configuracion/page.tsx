import { prisma } from "@/lib/prisma";
import { AdminTopbar } from "@/components/admin/topbar";
import { StoreProfileForm } from "@/components/admin/store-profile-form";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const store = await safe(() => prisma.storeProfile.findFirst(), null);

  const initial = {
    storeName: store?.storeName || "Lucia Jeans",
    tagline: store?.tagline || "",
    email: store?.email || "",
    phone: store?.phone || "",
    address: store?.address || "",
    city: store?.city || "",
    country: store?.country || "Perú",
    currency: store?.currency || "PEN",
    shippingNote: store?.shippingNote || "",
    about: store?.about || ""
  };

  return (
    <>
      <AdminTopbar title="Configuración" />
      <main className="p-6 lg:p-8">
        <StoreProfileForm
          initial={initial}
          sections={[
            {
              title: "Información general",
              fields: [
                { key: "storeName", label: "Nombre de la tienda" },
                { key: "tagline", label: "Tagline" },
                { key: "email", label: "Email de contacto", placeholder: "hola@luciajeans.com" },
                { key: "phone", label: "Teléfono", placeholder: "+51 999 999 999" },
                { key: "address", label: "Dirección" },
                { key: "city", label: "Ciudad" },
                { key: "country", label: "País" },
                { key: "about", label: "Acerca de la tienda", multiline: true }
              ]
            },
            {
              title: "Moneda y envío",
              fields: [
                { key: "currency", label: "Moneda (ISO)", placeholder: "PEN" },
                { key: "shippingNote", label: "Nota de envío", placeholder: "Envío gratis > S/199" }
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
