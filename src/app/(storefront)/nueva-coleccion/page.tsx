import type { Metadata } from "next";
import { getNewProducts } from "@/lib/queries";
import { ProductGrid } from "@/components/products/product-grid";
import { NewCollection } from "@/components/sections/new-collection";

export const metadata: Metadata = {
  title: "Nueva colección",
  description: "Descubre la nueva colección Lucia Jeans Otoño 2026."
};

export const revalidate = 300;

export default async function NewCollectionPage() {
  const items = await safe(() => getNewProducts(24), []);
  return (
    <>
      <NewCollection />
      <section className="section">
        <div className="container-lucia">
          <div className="mb-10">
            <span className="eyebrow mb-3">Drop Otoño 2026</span>
            <h2 className="heading-lg text-balance">Toda la nueva colección</h2>
          </div>
          {items.length > 0 ? (
            <ProductGrid products={items} />
          ) : (
            <p className="text-muted-foreground">Pronto verás aquí los nuevos arrivals.</p>
          )}
        </div>
      </section>
    </>
  );
}

async function safe<T>(fn: () => Promise<T>, fb: T): Promise<T> {
  try { return await fn(); } catch { return fb; }
}
