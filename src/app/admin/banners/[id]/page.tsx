import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminTopbar } from "@/components/admin/topbar";
import { BannerForm } from "@/components/admin/banner-form";

export const dynamic = "force-dynamic";

export default async function EditBannerPage({
  params
}: {
  params: { id: string };
}) {
  const banner = await prisma.banner
    .findUnique({ where: { id: params.id } })
    .catch(() => null);

  if (!banner) notFound();

  return (
    <>
      <AdminTopbar title={`Editar · ${banner.title}`} />
      <main className="p-6 lg:p-8">
        <BannerForm
          banner={{
            id: banner.id,
            title: banner.title,
            subtitle: banner.subtitle || "",
            imageUrl: banner.imageUrl,
            mobileUrl: banner.mobileUrl || "",
            ctaLabel: banner.ctaLabel || "",
            ctaUrl: banner.ctaUrl || "",
            position: banner.position,
            order: banner.order,
            isActive: banner.isActive
          }}
        />
      </main>
    </>
  );
}
