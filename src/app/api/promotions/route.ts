import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { promotionSchema } from "@/lib/validations";

export async function GET() {
  const promos = await prisma.promotion.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ promotions: promos });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const body = await req.json();
  const parsed = promotionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos inválidos", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const created = await prisma.promotion.create({
    data: {
      ...parsed.data,
      startsAt: new Date(parsed.data.startsAt),
      endsAt: new Date(parsed.data.endsAt),
      createdBy: session.sub as string
    }
  });
  return NextResponse.json({ promotion: created }, { status: 201 });
}
