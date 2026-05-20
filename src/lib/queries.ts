import { prisma } from "./prisma";
import type { Prisma } from "@prisma/client";

const PRODUCT_INCLUDE = {
  category: { select: { name: true, slug: true } }
} as const;

export type ProductWithCategory = Prisma.ProductGetPayload<{
  include: typeof PRODUCT_INCLUDE;
}>;

// Convert Decimal/dates to safe JSON-serializable shape for client components
export function serializeProduct(p: ProductWithCategory) {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    sku: p.sku,
    description: p.description,
    shortDesc: p.shortDesc,
    price: Number(p.price),
    compareAt: p.compareAt ? Number(p.compareAt) : null,
    currency: p.currency,
    coverImage: p.coverImage,
    images: p.images,
    colors: p.colors,
    sizes: p.sizes,
    tags: p.tags,
    isNew: p.isNew,
    isFeatured: p.isFeatured,
    isActive: p.isActive,
    rating: p.rating,
    reviewsCount: p.reviewsCount,
    category: p.category
      ? { name: p.category.name, slug: p.category.slug }
      : null
  };
}

export async function getFeaturedProducts(limit = 8) {
  const list = await prisma.product.findMany({
    where: { isActive: true, isFeatured: true },
    include: PRODUCT_INCLUDE,
    orderBy: { createdAt: "desc" },
    take: limit
  });
  return list.map(serializeProduct);
}

export async function getNewProducts(limit = 8) {
  const list = await prisma.product.findMany({
    where: { isActive: true, isNew: true },
    include: PRODUCT_INCLUDE,
    orderBy: { createdAt: "desc" },
    take: limit
  });
  return list.map(serializeProduct);
}

export async function getCategoriesFeatured() {
  return prisma.category.findMany({
    where: { isActive: true, isFeatured: true },
    orderBy: { order: "asc" }
  });
}

export async function getAllCategories() {
  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" }
  });
}

export async function getProductBySlug(slug: string) {
  const p = await prisma.product.findUnique({
    where: { slug },
    include: { ...PRODUCT_INCLUDE, inventory: true }
  });
  if (!p) return null;
  return {
    ...serializeProduct(p),
    inventory: p.inventory.map((i) => ({
      size: i.size,
      color: i.color,
      stock: i.stock
    }))
  };
}

export interface CatalogFilters {
  category?: string;
  search?: string;
  sizes?: string[];
  priceMin?: number;
  priceMax?: number;
  sort?: "newest" | "price_asc" | "price_desc" | "popular";
  page?: number;
  pageSize?: number;
}

export async function getCatalog(filters: CatalogFilters = {}) {
  const page = Math.max(1, filters.page || 1);
  const pageSize = Math.min(48, filters.pageSize || 12);

  const where: Prisma.ProductWhereInput = {
    isActive: true,
    ...(filters.category && { category: { slug: filters.category } }),
    ...(filters.search && {
      OR: [
        { name: { contains: filters.search, mode: "insensitive" } },
        { description: { contains: filters.search, mode: "insensitive" } },
        { tags: { hasSome: [filters.search.toLowerCase()] } }
      ]
    }),
    ...(filters.sizes &&
      filters.sizes.length > 0 && { sizes: { hasSome: filters.sizes } }),
    ...((filters.priceMin || filters.priceMax) && {
      price: {
        ...(filters.priceMin !== undefined ? { gte: filters.priceMin } : {}),
        ...(filters.priceMax !== undefined ? { lte: filters.priceMax } : {})
      }
    })
  };

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    filters.sort === "price_asc"
      ? { price: "asc" }
      : filters.sort === "price_desc"
      ? { price: "desc" }
      : filters.sort === "popular"
      ? { reviewsCount: "desc" }
      : { createdAt: "desc" };

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: PRODUCT_INCLUDE,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize
    }),
    prisma.product.count({ where })
  ]);

  return {
    items: items.map(serializeProduct),
    total,
    page,
    pageSize,
    pageCount: Math.ceil(total / pageSize)
  };
}

export async function getTestimonials() {
  return prisma.testimonial.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" }
  });
}

export async function getHeroBanners() {
  return prisma.banner.findMany({
    where: { isActive: true, position: "HERO" },
    orderBy: { order: "asc" }
  });
}

export async function getStoreProfile() {
  return prisma.storeProfile.findFirst();
}
