import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { bannerSchema } from "@/lib/validations";

export async function GET() {
  const banners = await prisma.banner.findMany({
    orderBy: [{ position: "asc" }, { order: "asc" }]
  });
  return NextResponse.json({ banners });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const body = await req.json();
  const parsed = bannerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos inválidos", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const created = await prisma.banner.create({
    data: { ...parsed.data, createdBy: session.sub as string }
  });
  return NextResponse.json({ banner: created }, { status: 201 });
}
