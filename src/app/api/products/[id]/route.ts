import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { productSchema } from "@/lib/validations";

interface Ctx { params: { id: string } }

export async function GET(_: NextRequest, { params }: Ctx) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: { category: true, inventory: true }
  });
  if (!product) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json({ product });
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await req.json();
  const parsed = productSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos", issues: parsed.error.flatten() }, { status: 400 });
  }

  const updated = await prisma.product.update({
    where: { id: params.id },
    data: parsed.data
  });

  return NextResponse.json({ product: updated });
}

export async function DELETE(_: NextRequest, { params }: Ctx) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  await prisma.product.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
