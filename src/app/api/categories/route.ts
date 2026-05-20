import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { categorySchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" }
  });
  return NextResponse.json({ categories });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await req.json();
  const parsed = categorySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos inválidos", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const created = await prisma.category.create({
    data: { ...data, slug: data.slug || slugify(data.name) }
  });

  return NextResponse.json({ category: created }, { status: 201 });
}
