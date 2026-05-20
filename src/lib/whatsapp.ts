import { formatPrice } from "./utils";

const PHONE =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "") || "51999999999";

interface ProductLike {
  name: string;
  price: number | string;
  slug: string;
}

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://lucia-jeans.vercel.app";

export function buildWhatsAppUrl(message: string, phone = PHONE) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function whatsappProductInquiry(p: ProductLike) {
  const url = `${SITE}/producto/${p.slug}`;
  const msg = `¡Hola Lucia Jeans! 💖
Me interesa este producto:

*${p.name}*
Precio: ${formatPrice(p.price)}
🔗 ${url}

¿Me das más información, por favor?`;
  return buildWhatsAppUrl(msg);
}

export function whatsappCatalogShare() {
  const msg = `¡Mira el nuevo catálogo de *Lucia Jeans*! 🌸
${SITE}/catalogo`;
  return buildWhatsAppUrl(msg);
}

export function whatsappGenericInquiry() {
  return buildWhatsAppUrl(
    "¡Hola Lucia Jeans! 💖 Me interesa conocer más sobre sus productos."
  );
}
