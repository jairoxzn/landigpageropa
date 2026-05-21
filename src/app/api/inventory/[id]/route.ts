import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { inventoryUpdateSchema } from "@/lib/validations";

interface Ctx { params: { id: string } }

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const body = await req.json();
  const parsed = inventoryUpdateSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  const updated = await prisma.inventory.update({
    where: { id: params.id },
    data: parsed.data
  });
  return NextResponse.json({ inventory: updated });
}
