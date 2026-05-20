import type { Metadata } from "next";
import { getAllCategories, getCatalog } from "@/lib/queries";
import { CatalogFilters } from "@/components/catalog/catalog-filters";
import { ProductGrid } from "@/components/products/product-grid";

export const metadata: Metadata = {
  title: "Catálogo",
  description: "Explora todo el catálogo Lucia Jeans: jeans, blusas, vestidos y más."
};

export const revalidate = 60;

interface PageProps {
  searchParams: {
    categoria?: string;
    q?: string;
    tallas?: string;
    min?: string;
    max?: string;
    orden?: "newest" | "price_asc" | "price_desc" | "popular";
    page?: string;
  };
}

export default async function CatalogPage({ searchParams }: PageProps) {
  const filters = {
    category: searchParams.categoria,
    search: searchParams.q,
    sizes: searchParams.tallas?.split(",").filter(Boolean),
    priceMin: searchParams.min ? Number(searchParams.min) : undefined,
    priceMax: searchParams.max ? Number(searchParams.max) : undefined,
    sort: searchParams.orden,
    page: searchParams.page ? Number(searchParams.page) : 1
  };

  const [categories, catalog] = await Promise.all([
    safe(() => getAllCategories(), []),
    safe(() => getCatalog(filters), {
      items: [],
      total: 0,
      page: 1,
      pageSize: 12,
      pageCount: 0
    })
  ]);

  return (
    <div className="container-lucia py-10 md:py-14">
      <header className="mb-10">
        <span className="eyebrow mb-3">Tienda</span>
        <h1 className="heading-lg mb-3 text-balance">
          Nuestro <span className="text-primary italic font-serif">catálogo</span>
        </h1>
        <p className="text-muted-foreground max-w-xl">
          Descubre toda la colección. Filtra por estilo, talla y precio para
          encontrar la pieza perfecta para ti.
        </p>
      </header>

      <CatalogFilters categories={categories} total={catalog.total} />

      {catalog.items.length === 0 ? (
        <div className="py-20 text-center">
          <div className="text-6xl mb-4">🌸</div>
          <h2 className="font-display text-2xl font-semibold mb-2">
            No hay productos con esos filtros
          </h2>
          <p className="text-muted-foreground">
            Prueba ajustando los criterios o limpia los filtros.
          </p>
        </div>
      ) : (
        <ProductGrid products={catalog.items} />
      )}

      {/* Pagination */}
      {catalog.pageCount > 1 && (
        <nav className="mt-12 flex items-center justify-center gap-2">
          {Array.from({ length: catalog.pageCount }).map((_, i) => {
            const p = i + 1;
            const isActive = p === catalog.page;
            const sp = new URLSearchParams(
              Object.entries(searchParams).filter(([, v]) => v !== undefined) as [
                string,
                string
              ][]
            );
            sp.set("page", String(p));
            return (
              <a
                key={p}
                href={`/catalogo?${sp.toString()}`}
                className={`h-10 min-w-10 grid place-items-center rounded-full text-sm font-medium border ${
                  isActive
                    ? "bg-primary text-white border-primary"
                    : "bg-background border-border hover:border-primary"
                }`}
              >
                {p}
              </a>
            );
          })}
        </nav>
      )}
    </div>
  );
}

async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}
