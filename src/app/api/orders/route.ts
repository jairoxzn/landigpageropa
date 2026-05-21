import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { orderSchema } from "@/lib/validations";
import { generateOrderNumber, formatPrice } from "@/lib/utils";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const url = new URL(req.url);
  const status = url.searchParams.get("status") || undefined;
  const orders = await prisma.order.findMany({
    where: { ...(status && { status: status as any }) },
    include: { items: true, customer: true },
    orderBy: { createdAt: "desc" },
    take: 100
  });
  return NextResponse.json({ orders });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = orderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const data = parsed.data;

    const phone = data.customer.phone.replace(/\D/g, "");
    const customer = await prisma.customer.upsert({
      where: { phone },
      update: {
        fullName: data.customer.fullName,
        email: data.customer.email || undefined,
        address: data.customer.address || undefined
      },
      create: {
        fullName: data.customer.fullName,
        phone,
        email: data.customer.email || undefined,
        address: data.customer.address || undefined
      }
    });

    const subtotal = data.items.reduce(
      (s, i) => s + i.quantity * i.unitPrice,
      0
    );
    const number = generateOrderNumber();

    const order = await prisma.order.create({
      data: {
        number,
        customerId: customer.id,
        channel: data.channel,
        notes: data.notes || undefined,
        shippingAddress: data.customer.address || undefined,
        subtotal,
        total: subtotal,
        items: {
          create: data.items.map((i) => ({
            productId: i.productId,
            name: i.name,
            size: i.size || undefined,
            color: i.color || undefined,
            quantity: i.quantity,
            unitPrice: i.unitPrice,
            subtotal: i.unitPrice * i.quantity
          }))
        }
      },
      include: { items: true, customer: true }
    });

    await prisma.customer.update({
      where: { id: customer.id },
      data: {
        ordersCount: { increment: 1 },
        totalSpent: { increment: subtotal }
      }
    });

    // Build the WhatsApp message for the client
    const lines = order.items
      .map(
        (i) =>
          `• ${i.name}${i.size ? ` (T${i.size}` : ""}${
            i.color ? `, ${i.color}` : ""
          }${i.size ? ")" : ""} x${i.quantity} — ${formatPrice(
            Number(i.subtotal)
          )}`
      )
      .join("\n");

    const whatsappMessage = `¡Hola Lucia Jeans! 💖
Quiero confirmar este pedido:

*N° ${order.number}*
${lines}

*Subtotal:* ${formatPrice(Number(order.subtotal))}
*Total:* ${formatPrice(Number(order.total))}

*Datos:*
👤 ${order.customer.fullName}
📱 +${order.customer.phone}${
      order.customer.address ? `\n📍 ${order.customer.address}` : ""
    }${order.notes ? `\n\n📝 Notas: ${order.notes}` : ""}`;

    return NextResponse.json({ order, whatsappMessage }, { status: 201 });
  } catch (err: any) {
    console.error("create order error", err);
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2021") {
      return NextResponse.json(
        { error: "La base de datos no está inicializada." },
        { status: 503 }
      );
    }
    if (err instanceof Prisma.PrismaClientInitializationError) {
      return NextResponse.json(
        { error: "No se pudo conectar a la base de datos." },
        { status: 503 }
      );
    }
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
