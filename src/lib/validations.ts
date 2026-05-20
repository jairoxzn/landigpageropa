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
