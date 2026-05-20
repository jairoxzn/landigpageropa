import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { categorySchema } from "@/lib/validations";

interface Ctx { params: { id: string } }

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const body = await req.json();
  const parsed = categorySchema.partial().safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });

  const updated = await prisma.category.update({
    where: { id: params.id },
    data: parsed.data
  });
  return NextResponse.json({ category: updated });
}

export async function DELETE(_: NextRequest, { params }: Ctx) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  await prisma.category.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
