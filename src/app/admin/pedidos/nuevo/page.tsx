import { prisma } from "@/lib/prisma";
import { AdminTopbar } from "@/components/admin/topbar";
import { OrderForm } from "@/components/admin/order-form";

export const dynamic = "force-dynamic";

export default async function NewOrderPage() {
  const products = await safe(
    () =>
      prisma.product.findMany({
        where: { isActive: true },
        select: {
          id: true,
          name: true,
          price: true,
          coverImage: true,
          sizes: true,
          colors: true
        },
        orderBy: { name: "asc" }
      }),
    []
  );

  const options = products.map((p) => ({
    id: p.id,
    name: p.name,
    price: Number(p.price),
    coverImage: p.coverImage,
    sizes: p.sizes,
    colors: p.colors
  }));

  return (
    <>
      <AdminTopbar title="Nuevo pedido" />
      <main className="p-6 lg:p-8">
        <OrderForm products={options} />
      </main>
    </>
  );
}
async function safe<T>(fn: () => Promise<T>, fb: T): Promise<T> {
  try { return await fn(); } catch { return fb; }
}
