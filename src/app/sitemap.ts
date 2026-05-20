import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://lucia-jeans.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base: MetadataRoute.Sitemap = [
    { url: `${SITE}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE}/catalogo`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE}/nueva-coleccion`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE}/contacto`, changeFrequency: "yearly", priority: 0.5 }
  ];

  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true }
    });
    const productUrls = products.map((p) => ({
      url: `${SITE}/producto/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8
    }));
    return [...base, ...productUrls];
  } catch {
    return base;
  }
}
