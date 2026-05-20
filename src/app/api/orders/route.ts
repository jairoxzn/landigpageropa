import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { orderSchema } from "@/lib/validations";
import { generateOrderNumber } from "@/lib/utils";
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
  const body = await req.json();
  const parsed = orderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos inválidos", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const data = parsed.data;

  const customer = await prisma.customer.upsert({
    where: { phone: data.customer.phone },
    update: {
      fullName: data.customer.fullName,
      email: data.customer.email || undefined,
      address: data.customer.address || undefined
    },
    create: {
      fullName: data.customer.fullName,
      phone: data.customer.phone,
      email: data.customer.email || undefined,
      address: data.customer.address || undefined
    }
  });

  const subtotal = data.items.reduce(
    (s, i) => s + i.quantity * i.unitPrice,
    0
  );

  const order = await prisma.order.create({
    data: {
      number: generateOrderNumber(),
      customerId: customer.id,
      channel: data.channel,
      notes: data.notes || undefined,
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

  return NextResponse.json({ order }, { status: 201 });
}
