import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { orderStatusSchema } from "@/lib/validations";

interface Ctx { params: { id: string } }

export async function GET(_: NextRequest, { params }: Ctx) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: true, customer: true }
  });
  if (!order) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json({ order });
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const body = await req.json();
  const parsed = orderStatusSchema.partial().safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  const updated = await prisma.order.update({
    where: { id: params.id },
    data: parsed.data
  });
  return NextResponse.json({ order: updated });
}

export async function DELETE(_: NextRequest, { params }: Ctx) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  await prisma.order.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
