# 🌸 Lucia Jeans — eCommerce Premium

Plataforma completa para una boutique femenina premium especializada en jeans y moda mujer. Diseño boutique inspirado en Zara, Bershka y Shein Premium, enfocado en conversión por WhatsApp / Instagram / Facebook.

> **Stack:** Next.js 14 (App Router) · TypeScript · TailwindCSS · Prisma ORM · PostgreSQL (Neon) · Shadcn-style UI · Framer Motion · Cloudinary · Zustand · Vercel

---

## ✨ Características

### 🛍️ Storefront
- Landing premium con hero animado, banners, carrusel, categorías, productos destacados, "Nueva colección", testimonios, galería Instagram y CTA de compartir catálogo.
- Catálogo con filtros (categoría, talla, precio, búsqueda), orden, paginación y vista grid moderna.
- Quick view modal de producto, página de detalle con galería y selección de talla/color.
- Carrito persistente (Zustand) con checkout por WhatsApp.
- Botón flotante de WhatsApp con animación.
- Modo claro / oscuro, animaciones Framer Motion, skeleton loading, toasts (Sonner).
- SEO completo (metadata dinámica, OpenGraph, sitemap, robots).

### 🛠 Panel administrativo (`/admin`)
- Login seguro con JWT (HS256, cookies httpOnly).
- Dashboard con KPIs (ingresos, pedidos, productos, clientes), pedidos recientes y alertas de stock bajo.
- CRUD de productos con formulario premium y upload Cloudinary.
- Listados de categorías, pedidos, clientes, inventario, promociones, banners, redes sociales y configuración.
- Middleware de protección de rutas + auditoría preparada en schema.

### 🗂 Modelos Prisma
- `User`, `Customer`, `Category`, `Product`, `Inventory`, `Order`, `OrderItem`, `Promotion`, `Banner`, `Setting`, `StoreProfile`, `Testimonial`, `AuditLog`.

---

## 🚀 Quick start

### 1) Requisitos
- Node.js 20+
- Cuenta en [Neon](https://neon.tech) (PostgreSQL serverless)
- Cuenta en [Cloudinary](https://cloudinary.com) (opcional, para uploads)

### 2) Instalación

```bash
git clone <repo>
cd lucia-jeans
npm install
cp .env.example .env
```

### 3) Configura `.env`

```env
DATABASE_URL="postgresql://user:pass@ep-xxx.region.aws.neon.tech/lucia?sslmode=require"
JWT_SECRET="<openssl rand -hex 32>"
NEXT_PUBLIC_WHATSAPP_NUMBER="51999999999"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NEXT_PUBLIC_INSTAGRAM_URL="https://instagram.com/luciajeans"
NEXT_PUBLIC_FACEBOOK_URL="https://facebook.com/luciajeans"
ADMIN_EMAIL="admin@luciajeans.com"
ADMIN_PASSWORD="Lucia#2026"

# Cloudinary (opcional)
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
```

### 4) Base de datos + seed

```bash
npm run db:push      # Crea tablas en Neon
npm run db:seed      # Inserta categorías, productos demo, admin y banners
```

### 5) Run

```bash
npm run dev
```

- Tienda: <http://localhost:3000>
- Admin: <http://localhost:3000/admin/login>
  - **Email:** `admin@luciajeans.com`
  - **Pass:** `Lucia#2026`

---

## 🌐 Deploy en Vercel

1. Sube el repositorio a GitHub.
2. En Vercel, importa el repo.
3. Agrega las variables de entorno (mismas que `.env`).
4. **Build command:** `prisma generate && next build` (ya configurado en `package.json`).
5. Deploy.

> **Tip:** Configura los dominios `lucia-jeans.vercel.app` o tu dominio custom y actualiza `NEXT_PUBLIC_SITE_URL`.

---

## 🗂 Estructura

```
src/
  app/
    (storefront)/           → Landing + catálogo + producto + contacto
    (admin-auth)/admin/     → Login bypass del layout protegido
    admin/                  → Dashboard, CRUDs (protegidos)
    api/                    → REST endpoints (auth, products, categories, orders, upload)
    layout.tsx              → Root layout (fuentes, theme, toaster)
    globals.css             → Design tokens
    sitemap.ts · robots.ts
  components/
    layout/                 → Navbar, Footer
    sections/               → Hero, Categories, Featured, NewCollection, …
    products/               → ProductCard, QuickView, ProductDetail, Grid
    admin/                  → Sidebar, Topbar, StatCard, ProductForm
    common/                 → ThemeToggle, WhatsappFab, CartDrawer
    ui/                     → Primitives (Button, Input, Dialog, …)
    providers/              → ThemeProvider
  lib/
    prisma.ts · auth.ts · utils.ts · whatsapp.ts · cloudinary.ts
    validations.ts · queries.ts
  store/
    cart-store.ts · filter-store.ts
  middleware.ts             → Protege /admin/*
prisma/
  schema.prisma · seed.ts
```

---

## 🎨 Diseño

| Token | Valor |
|---|---|
| Primary (rosado) | `#ff4fa3` |
| Negro | `#000000` |
| Blanco | `#ffffff` |
| Fuente display | Poppins |
| Fuente sans | Inter |
| Fuente serif (acentos) | Playfair Display |
| Radio base | 0.85rem |

Estilos premium: cards con shadow suave, gradientes radiales en hero, marquee bar, fondo grain sutil, animaciones Framer Motion en todas las secciones.

---

## 💬 Integración con redes

- WhatsApp: configurado vía `NEXT_PUBLIC_WHATSAPP_NUMBER`. Cada producto tiene su CTA "Consultar" con mensaje pre-armado.
- Carrito → "Finalizar por WhatsApp" envía el resumen completo del pedido.
- Compartir catálogo por WhatsApp/IG/FB desde la home.
- `navigator.share` nativo + fallback `clipboard` para compartir productos.

---

## 🛡 Seguridad

- JWT en cookie `httpOnly + sameSite=lax`.
- Validación de inputs con Zod en cada endpoint mutante.
- Middleware protege todas las rutas `/admin/*`.
- Bcrypt para passwords (rounds=10).
- Variables sensibles solo en server, prefijo `NEXT_PUBLIC_` solo cuando es seguro exponer.

---

## 📈 Performance

- ISR (revalidate 60-300s) en landing y catálogo.
- Image optimization (avif/webp), priority hint en hero.
- Lazy loading nativo en imágenes del catálogo.
- `optimizePackageImports` para `lucide-react` y `framer-motion`.

---

## 📜 Scripts

| Script | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build producción (incluye `prisma generate`) |
| `npm run start` | Levanta build de producción |
| `npm run db:push` | Sincroniza schema con Neon |
| `npm run db:migrate` | Crea migración versionada |
| `npm run db:seed` | Carga datos demo |
| `npm run db:studio` | Abre Prisma Studio |

---

Hecho con 💖 para mujeres que aman verse increíbles.
