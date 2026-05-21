import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { storeProfileSchema } from "@/lib/validations";

export async function GET() {
  const profile = await prisma.storeProfile.findFirst();
  return NextResponse.json({ profile });
}

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await req.json();
  const parsed = storeProfileSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos inválidos", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  // Clean empty strings → null
  const data = Object.fromEntries(
    Object.entries(parsed.data).map(([k, v]) => [k, v === "" ? null : v])
  );

  const existing = await prisma.storeProfile.findFirst();
  const profile = existing
    ? await prisma.storeProfile.update({ where: { id: existing.id }, data })
    : await prisma.storeProfile.create({
        data: { storeName: "Lucia Jeans", ...data }
      });

  return NextResponse.json({ profile });
}
