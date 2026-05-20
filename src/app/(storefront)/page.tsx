import { Hero } from "@/components/sections/hero";
import { MarqueeBar } from "@/components/sections/marquee-bar";
import { Benefits } from "@/components/sections/benefits";
import { PromoCarousel } from "@/components/sections/promo-carousel";
import { Categories } from "@/components/sections/categories";
import { FeaturedProducts } from "@/components/sections/featured-products";
import { NewCollection } from "@/components/sections/new-collection";
import { Testimonials } from "@/components/sections/testimonials";
import { InstagramGallery } from "@/components/sections/instagram-gallery";
import { ShareCatalog } from "@/components/sections/share-catalog";
import {
  getCategoriesFeatured,
  getFeaturedProducts,
  getHeroBanners,
  getNewProducts,
  getTestimonials
} from "@/lib/queries";

export const revalidate = 300; // ISR – 5 min

export default async function HomePage() {
  // Wrap in try to allow building before DB is connected
  const [categories, featured, news, testimonials, banners] = await Promise.all([
    safe(() => getCategoriesFeatured(), []),
    safe(() => getFeaturedProducts(8), []),
    safe(() => getNewProducts(8), []),
    safe(() => getTestimonials(), []),
    safe(() => getHeroBanners(), [])
  ]);

  return (
    <>
      <Hero />
      <MarqueeBar />
      <Benefits />

      {banners.length > 0 && (
        <PromoCarousel
          slides={banners.map((b) => ({
            id: b.id,
            title: b.title,
            subtitle: b.subtitle,
            imageUrl: b.imageUrl,
            ctaLabel: b.ctaLabel,
            ctaUrl: b.ctaUrl
          }))}
        />
      )}

      {categories.length > 0 && <Categories items={categories} />}
      {featured.length > 0 && (
        <FeaturedProducts
          products={featured}
          title="Productos destacados"
          subtitle="Los favoritos de la comunidad Lucia."
        />
      )}
      <NewCollection />
      {news.length > 0 && (
        <FeaturedProducts
          products={news}
          eyebrow="Recién llegados"
          title="Nuevos arrivals"
          subtitle="Lo último que llegó a la boutique. Stock limitado."
        />
      )}
      {testimonials.length > 0 && <Testimonials items={testimonials} />}
      <InstagramGallery />
      <ShareCatalog />
    </>
  );
}

async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (e) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("⚠️  Query failed (using fallback):", (e as Error).message);
    }
    return fallback;
  }
}
