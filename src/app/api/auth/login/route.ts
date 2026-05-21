import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validations";
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
  } catch (err: any) {
    console.error("login error", err);

    // DB no inicializada (tablas no existen)
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2021"
    ) {
      return NextResponse.json(
        {
          error:
            "La base de datos no está inicializada. Ejecuta: npm run db:push && npm run db:admin"
        },
        { status: 503 }
      );
    }

    // Error de conexión a la DB
    if (err instanceof Prisma.PrismaClientInitializationError) {
      return NextResponse.json(
        { error: "No se pudo conectar a la base de datos. Revisa DATABASE_URL en .env" },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
