import { AdminTopbar } from "@/components/admin/topbar";
import { BannerForm } from "@/components/admin/banner-form";

export const dynamic = "force-dynamic";

export default function NewBannerPage() {
  return (
    <>
      <AdminTopbar title="Nuevo banner" />
      <main className="p-6 lg:p-8">
        <BannerForm />
      </main>
    </>
  );
}
