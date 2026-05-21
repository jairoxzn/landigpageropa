import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { promotionSchema } from "@/lib/validations";

interface Ctx { params: { id: string } }

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const body = await req.json();
  const parsed = promotionSchema.partial().safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  const updated = await prisma.promotion.update({
    where: { id: params.id },
    data: {
      ...parsed.data,
      ...(parsed.data.startsAt && { startsAt: new Date(parsed.data.startsAt) }),
      ...(parsed.data.endsAt && { endsAt: new Date(parsed.data.endsAt) })
    }
  });
  return NextResponse.json({ promotion: updated });
}

export async function DELETE(_: NextRequest, { params }: Ctx) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  await prisma.promotion.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
