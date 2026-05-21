import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminTopbar } from "@/components/admin/topbar";
import { PromotionForm } from "@/components/admin/promotion-form";

export const dynamic = "force-dynamic";

export default async function EditPromotionPage({
  params
}: {
  params: { id: string };
}) {
  const promo = await prisma.promotion
    .findUnique({ where: { id: params.id } })
    .catch(() => null);

  if (!promo) notFound();

  return (
    <>
      <AdminTopbar title={`Editar · ${promo.name}`} />
      <main className="p-6 lg:p-8">
        <PromotionForm
          promotion={{
            id: promo.id,
            name: promo.name,
            code: promo.code || "",
            type: promo.type,
            value: Number(promo.value),
            description: promo.description || "",
            startsAt: promo.startsAt.toISOString(),
            endsAt: promo.endsAt.toISOString(),
            isActive: promo.isActive
          }}
        />
      </main>
    </>
  );
}
