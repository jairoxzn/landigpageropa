import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { productSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const search = url.searchParams.get("q") || undefined;
  const category = url.searchParams.get("category") || undefined;
  const take = Math.min(50, Number(url.searchParams.get("take") || 20));

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } }
        ]
      }),
      ...(category && { category: { slug: category } })
    },
    include: { category: { select: { name: true, slug: true } } },
    orderBy: { createdAt: "desc" },
    take
  });

  return NextResponse.json({ products });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await req.json();
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos inválidos", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const slug = data.slug || slugify(data.name);

  const created = await prisma.product.create({
    data: { ...data, slug }
  });

  return NextResponse.json({ product: created }, { status: 201 });
}
