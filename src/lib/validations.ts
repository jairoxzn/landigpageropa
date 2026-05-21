import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Correo inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres")
});
export type LoginInput = z.infer<typeof loginSchema>;

export const productSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  sku: z.string().optional().nullable(),
  description: z.string().min(10),
  shortDesc: z.string().optional().nullable(),
  price: z.coerce.number().positive(),
  compareAt: z.coerce.number().positive().optional().nullable(),
  coverImage: z.string().url(),
  images: z.array(z.string().url()).default([]),
  colors: z.array(z.string()).default([]),
  sizes: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  categoryId: z.string().cuid(),
  isNew: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true)
});
export type ProductInput = z.infer<typeof productSchema>;

export const categorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional().nullable(),
  imageUrl: z.string().url().optional().nullable(),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  order: z.coerce.number().int().default(0)
});
export type CategoryInput = z.infer<typeof categorySchema>;

export const bannerSchema = z.object({
  title: z.string().min(2),
  subtitle: z.string().optional().nullable(),
  imageUrl: z.string().url(),
  mobileUrl: z.string().url().optional().nullable(),
  ctaLabel: z.string().optional().nullable(),
  ctaUrl: z.string().optional().nullable(),
  position: z.enum(["HERO", "TOP_BAR", "CATEGORY", "CHECKOUT", "FOOTER"]).default("HERO"),
  order: z.coerce.number().int().default(0),
  isActive: z.boolean().default(true)
});
export type BannerInput = z.infer<typeof bannerSchema>;

export const promotionSchema = z.object({
  name: z.string().min(2),
  code: z.string().optional().nullable(),
  type: z.enum(["PERCENT", "FIXED", "BUY_X_GET_Y", "FREE_SHIPPING"]).default("PERCENT"),
  value: z.coerce.number().min(0),
  description: z.string().optional().nullable(),
  bannerUrl: z.string().url().optional().nullable(),
  startsAt: z.string(),
  endsAt: z.string(),
  isActive: z.boolean().default(true)
});
export type PromotionInput = z.infer<typeof promotionSchema>;

export const orderStatusSchema = z.object({
  status: z.enum([
    "PENDING",
    "CONFIRMED",
    "PAID",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
    "REFUNDED"
  ]),
  trackingCode: z.string().optional().nullable(),
  notes: z.string().optional().nullable()
});

export const storeProfileSchema = z.object({
  storeName: z.string().min(1),
  tagline: z.string().optional().nullable(),
  logoUrl: z.string().url().optional().nullable(),
  faviconUrl: z.string().url().optional().nullable(),
  email: z.string().email().optional().nullable().or(z.literal("")),
  phone: z.string().optional().nullable(),
  whatsapp: z.string().optional().nullable(),
  instagram: z.string().optional().nullable(),
  facebook: z.string().optional().nullable(),
  tiktok: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  currency: z.string().default("PEN"),
  shippingNote: z.string().optional().nullable(),
  about: z.string().optional().nullable()
});

export const inventoryUpdateSchema = z.object({
  stock: z.coerce.number().int().min(0),
  lowStockAt: z.coerce.number().int().min(0).optional()
});

export const orderSchema = z.object({
  customer: z.object({
    fullName: z.string().min(2),
    phone: z.string().min(6),
    email: z.string().email().optional().nullable(),
    address: z.string().optional().nullable()
  }),
  items: z
    .array(
      z.object({
        productId: z.string().cuid(),
        name: z.string(),
        size: z.string().optional().nullable(),
        color: z.string().optional().nullable(),
        quantity: z.number().int().positive(),
        unitPrice: z.coerce.number().positive()
      })
    )
    .min(1),
  channel: z.enum(["WHATSAPP", "INSTAGRAM", "FACEBOOK", "WEBSITE", "STORE"]).default("WHATSAPP"),
  notes: z.string().optional().nullable()
});
export type OrderInput = z.infer<typeof orderSchema>;
