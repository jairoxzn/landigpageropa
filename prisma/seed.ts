import { PrismaClient, Role, BannerPosition, PromoType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// ------------------------------------------------------------
// Helpers
// ------------------------------------------------------------

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

// Demo image pool (Unsplash women fashion)
const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=80`;

// ------------------------------------------------------------
// Data
// ------------------------------------------------------------

const categories = [
  {
    name: "Jeans",
    description: "Jeans tiro alto, skinny, wide y mom — el corazón de Lucia.",
    imageUrl: img("photo-1582418702059-97ebafb35d09"),
    isFeatured: true,
    order: 1
  },
  {
    name: "Blusas",
    description: "Blusas elegantes, casuales y de noche.",
    imageUrl: img("photo-1551163943-3f7053a3f5a3"),
    isFeatured: true,
    order: 2
  },
  {
    name: "Vestidos",
    description: "Vestidos para cada ocasión, del día a la noche.",
    imageUrl: img("photo-1539008835657-9e8e9680c956"),
    isFeatured: true,
    order: 3
  },
  {
    name: "Faldas",
    description: "Faldas cortas, midi y largas con estilo único.",
    imageUrl: img("photo-1583496661160-fb5886a13d44"),
    isFeatured: true,
    order: 4
  },
  {
    name: "Accesorios",
    description: "Carteras, cinturones y joyas para completar tu look.",
    imageUrl: img("photo-1611923134239-b9be5816e23d"),
    isFeatured: false,
    order: 5
  }
];

const products = [
  {
    category: "Jeans",
    name: "Jean Skinny Tiro Alto Diana",
    price: 149.9,
    compareAt: 199.9,
    cover: "photo-1541099649105-f69ad21f3246",
    images: ["photo-1541099649105-f69ad21f3246", "photo-1604176354204-9268737828e4"],
    colors: ["Azul Clásico", "Negro", "Celeste"],
    sizes: ["26", "28", "30", "32", "34"],
    shortDesc: "Diseño tiro alto que estiliza tu silueta.",
    description:
      "Jean skinny de tiro alto Diana con tela elastizada premium, costuras reforzadas y un calce que abraza tu figura.",
    isNew: true,
    isFeatured: true,
    tags: ["best-seller", "tiro-alto"],
    rating: 4.9
  },
  {
    category: "Jeans",
    name: "Wide Leg Vintage Mia",
    price: 169.9,
    cover: "photo-1604176354204-9268737828e4",
    images: ["photo-1604176354204-9268737828e4"],
    colors: ["Azul Lavado", "Beige"],
    sizes: ["26", "28", "30", "32"],
    shortDesc: "Pierna ancha estilo vintage 90s.",
    description:
      "Jean wide leg con caída fluida, perfecto para looks urbanos con botines o zapatillas.",
    isNew: true,
    isFeatured: true,
    rating: 4.8
  },
  {
    category: "Jeans",
    name: "Mom Jean Bordado Romina",
    price: 139.9,
    cover: "photo-1582418702059-97ebafb35d09",
    images: ["photo-1582418702059-97ebafb35d09"],
    colors: ["Azul Vintage"],
    sizes: ["26", "28", "30", "32"],
    shortDesc: "Mom jean con detalles bordados a mano.",
    description:
      "Mom jean inspirado en los 90s, con bordado floral exclusivo en los bolsillos.",
    isFeatured: true,
    rating: 4.7
  },
  {
    category: "Blusas",
    name: "Blusa Satinada Camila",
    price: 89.9,
    compareAt: 119.9,
    cover: "photo-1551163943-3f7053a3f5a3",
    images: ["photo-1551163943-3f7053a3f5a3"],
    colors: ["Rosa Palo", "Blanco", "Negro"],
    sizes: ["XS", "S", "M", "L"],
    shortDesc: "Caída fluida y brillo elegante.",
    description:
      "Blusa de satén con manga larga, cierre de botones nacarados y caída envolvente.",
    isFeatured: true,
    isNew: true,
    rating: 4.9
  },
  {
    category: "Blusas",
    name: "Crop Top Cuello Halter Sofía",
    price: 69.9,
    cover: "photo-1564257631407-4deb1f99d992",
    images: ["photo-1564257631407-4deb1f99d992"],
    colors: ["Negro", "Rosa"],
    sizes: ["XS", "S", "M"],
    shortDesc: "Cuello halter y espalda descubierta.",
    description: "Crop top de tela suave con detalle halter, ideal para una noche fresca.",
    rating: 4.6
  },
  {
    category: "Vestidos",
    name: "Vestido Midi Floral Antonella",
    price: 199.9,
    cover: "photo-1539008835657-9e8e9680c956",
    images: ["photo-1539008835657-9e8e9680c956"],
    colors: ["Estampado Floral"],
    sizes: ["S", "M", "L"],
    shortDesc: "Estampado floral exclusivo Lucia.",
    description:
      "Vestido midi con tirantes finos, cintura ceñida y vuelo amplio. Estampado floral diseñado por Lucia Studio.",
    isFeatured: true,
    isNew: true,
    rating: 5.0
  },
  {
    category: "Vestidos",
    name: "Vestido Negro Cocktail Valentina",
    price: 229.9,
    compareAt: 289.9,
    cover: "photo-1566174053879-31528523f8ae",
    images: ["photo-1566174053879-31528523f8ae"],
    colors: ["Negro"],
    sizes: ["XS", "S", "M", "L"],
    shortDesc: "Pequeño vestido negro reinventado.",
    description:
      "Vestido entallado con detalle drapeado en cintura, perfecto para una cita o evento de noche.",
    isFeatured: true,
    rating: 4.9
  },
  {
    category: "Faldas",
    name: "Falda Midi Plisada Bianca",
    price: 109.9,
    cover: "photo-1583496661160-fb5886a13d44",
    images: ["photo-1583496661160-fb5886a13d44"],
    colors: ["Rosa", "Beige", "Negro"],
    sizes: ["S", "M", "L"],
    shortDesc: "Falda midi plisada con caída de ensueño.",
    description:
      "Falda midi plisada con cintura elasticada cómoda. Combínala con un crop top o blusa.",
    isNew: true,
    rating: 4.7
  },
  {
    category: "Accesorios",
    name: "Cartera Mini Estructurada Luna",
    price: 159.9,
    cover: "photo-1611923134239-b9be5816e23d",
    images: ["photo-1611923134239-b9be5816e23d"],
    colors: ["Rosa", "Negro", "Crema"],
    sizes: ["Única"],
    shortDesc: "Mini bag estructurada con cadena dorada.",
    description: "Mini cartera estructurada con asa rígida y cadena dorada removible.",
    isFeatured: true,
    rating: 4.8
  }
];

const testimonials = [
  {
    name: "Camila Torres",
    role: "Cliente verificada",
    avatarUrl: img("photo-1494790108377-be9c29b29330"),
    rating: 5,
    comment:
      "Los jeans de Lucia son los únicos que me quedan perfectos. ¡Ya tengo 4 modelos!"
  },
  {
    name: "Daniela Vega",
    role: "Influencer",
    avatarUrl: img("photo-1438761681033-6461ffad8d80"),
    rating: 5,
    comment:
      "Calidad premium, entrega rápida y atención por WhatsApp impecable. 100% recomendado."
  },
  {
    name: "Andrea Salazar",
    role: "Cliente VIP",
    avatarUrl: img("photo-1534528741775-53994a69daeb"),
    rating: 5,
    comment:
      "El vestido midi es soñado, recibí muchos cumplidos. Lucia se volvió mi tienda favorita."
  }
];

// ------------------------------------------------------------
// Seed
// ------------------------------------------------------------

async function main() {
  console.log("🌸 Seeding Lucia Jeans...");

  // --- Admin user ----------------------------------------------------------
  const adminEmail = process.env.ADMIN_EMAIL || "admin@luciajeans.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "Lucia#2026";
  const hash = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: hash,
      name: "Lucia Admin",
      role: Role.SUPER_ADMIN
    }
  });
  console.log(`  → Admin: ${admin.email}`);

  // --- Store profile -------------------------------------------------------
  await prisma.storeProfile.deleteMany();
  await prisma.storeProfile.create({
    data: {
      storeName: "Lucia Jeans",
      tagline: "Moda femenina premium · Jeans que enamoran",
      email: "hola@luciajeans.com",
      phone: "+51 999 999 999",
      whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "51999999999",
      instagram: "https://instagram.com/luciajeans",
      facebook: "https://facebook.com/luciajeans",
      tiktok: "https://tiktok.com/@luciajeans",
      address: "Av. La Marina 123, Lima",
      city: "Lima",
      country: "Perú",
      about:
        "Lucia Jeans es una boutique femenina enfocada en jeans premium, blusas y vestidos para mujeres que aman verse increíbles todos los días."
    }
  });

  // --- Categories ----------------------------------------------------------
  for (const c of categories) {
    await prisma.category.upsert({
      where: { slug: slugify(c.name) },
      update: {},
      create: { ...c, slug: slugify(c.name) }
    });
  }
  console.log(`  → ${categories.length} categorías`);

  // --- Products ------------------------------------------------------------
  for (const p of products) {
    const category = await prisma.category.findUnique({
      where: { slug: slugify(p.category) }
    });
    if (!category) continue;

    const slug = slugify(p.name);
    const product = await prisma.product.upsert({
      where: { slug },
      update: {},
      create: {
        name: p.name,
        slug,
        sku: `LJ-${slug.toUpperCase().slice(0, 10)}-${Math.floor(Math.random() * 999)}`,
        description: p.description,
        shortDesc: p.shortDesc,
        price: p.price,
        compareAt: p.compareAt,
        coverImage: img(p.cover),
        images: p.images.map(img),
        colors: p.colors,
        sizes: p.sizes,
        tags: p.tags || [],
        isNew: !!p.isNew,
        isFeatured: !!p.isFeatured,
        rating: p.rating || 4.5,
        reviewsCount: Math.floor(Math.random() * 200) + 20,
        categoryId: category.id,
        metaTitle: `${p.name} | Lucia Jeans`,
        metaDesc: p.shortDesc
      }
    });

    // Inventory per size
    for (const size of p.sizes) {
      await prisma.inventory.upsert({
        where: {
          productId_size_color: {
            productId: product.id,
            size,
            color: p.colors[0] || ""
          }
        },
        update: {},
        create: {
          productId: product.id,
          size,
          color: p.colors[0],
          stock: Math.floor(Math.random() * 25) + 5
        }
      });
    }
  }
  console.log(`  → ${products.length} productos`);

  // --- Testimonials --------------------------------------------------------
  await prisma.testimonial.deleteMany();
  for (const [i, t] of testimonials.entries()) {
    await prisma.testimonial.create({ data: { ...t, order: i } });
  }
  console.log(`  → ${testimonials.length} testimonios`);

  // --- Banners -------------------------------------------------------------
  await prisma.banner.deleteMany();
  await prisma.banner.createMany({
    data: [
      {
        title: "Nueva Colección Otoño",
        subtitle: "Hasta 40% OFF en jeans seleccionados",
        imageUrl: img("photo-1490481651871-ab68de25d43d"),
        ctaLabel: "Comprar ahora",
        ctaUrl: "/catalogo?coleccion=otono",
        position: BannerPosition.HERO,
        order: 1,
        createdBy: admin.id
      },
      {
        title: "Free Shipping > S/199",
        subtitle: "Envío gratis a todo Lima",
        imageUrl: img("photo-1483985988355-763728e1935b"),
        ctaLabel: "Ver más",
        ctaUrl: "/catalogo",
        position: BannerPosition.HERO,
        order: 2,
        createdBy: admin.id
      }
    ]
  });

  // --- Promotions ----------------------------------------------------------
  await prisma.promotion.deleteMany();
  await prisma.promotion.create({
    data: {
      name: "Lucia Welcome 15",
      code: "LUCIA15",
      type: PromoType.PERCENT,
      value: 15,
      description: "15% OFF en tu primera compra",
      startsAt: new Date(),
      endsAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      createdBy: admin.id
    }
  });

  console.log("✅ Seed completado.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
