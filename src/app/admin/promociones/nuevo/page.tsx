import { AdminTopbar } from "@/components/admin/topbar";
import { PromotionForm } from "@/components/admin/promotion-form";

export const dynamic = "force-dynamic";

export default function NewPromotionPage() {
  return (
    <>
      <AdminTopbar title="Nueva promoción" />
      <main className="p-6 lg:p-8">
        <PromotionForm />
      </main>
    </>
  );
}
