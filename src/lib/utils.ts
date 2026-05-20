import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Tailwind class merger — Shadcn convention.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format price in PEN (default) or custom currency.
 */
export function formatPrice(
  value: number | string,
  currency: string = "PEN",
  locale: string = "es-PE"
) {
  const n = typeof value === "string" ? parseFloat(value) : value;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2
  }).format(n);
}

/**
 * Slugify with Unicode normalization (handles accents, etc.).
 */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Random order number like LJ-20260520-3F8X
 */
export function generateOrderNumber(): string {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(
    d.getDate()
  ).padStart(2, "0")}`;
  const rnd = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `LJ-${ymd}-${rnd}`;
}

/**
 * Human-readable date (es-PE).
 */
export function formatDate(value: Date | string) {
  return new Intl.DateTimeFormat("es-PE", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

/**
 * Discount percentage from compareAt.
 */
export function discountPercent(price: number, compareAt?: number | null) {
  if (!compareAt || compareAt <= price) return 0;
  return Math.round(((compareAt - price) / compareAt) * 100);
}

/**
 * Truncate string with ellipsis.
 */
export function truncate(s: string, max = 80) {
  return s.length > max ? `${s.substring(0, max - 1)}…` : s;
}
