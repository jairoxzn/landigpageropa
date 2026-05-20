import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  loginSchema
} from "@/lib/validations";
import {
  setSessionCookie,
  signSession,
  verifyPassword
} from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.isActive) {
      return NextResponse.json(
        { error: "Credenciales incorrectas" },
        { status: 401 }
      );
    }

    const ok = await verifyPassword(password, user.password);
    if (!ok) {
      return NextResponse.json(
        { error: "Credenciales incorrectas" },
        { status: 401 }
      );
    }

    const token = await signSession({
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    });

    await setSessionCookie(token);
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    return NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (err) {
    console.error("login error", err);
    return NextResponse.json(
      { error: "Error interno" },
      { status: 500 }
    );
  }
}
