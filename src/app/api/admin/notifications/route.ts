import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session)
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  try {
    const [pendingOrders, recentOrders, lowStockItems] = await Promise.all([
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.order.findMany({
        where: { status: "PENDING" },
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { customer: { select: { fullName: true } } }
      }),
      prisma.inventory.count({
        where: { stock: { lte: 5 } }
      })
    ]);

    return NextResponse.json({
      counts: {
        pendingOrders,
        lowStock: lowStockItems,
        total: pendingOrders + lowStockItems
      },
      recent: recentOrders.map((o) => ({
        id: o.id,
        number: o.number,
        customer: o.customer?.fullName || "—",
        total: Number(o.total),
        createdAt: o.createdAt
      }))
    });
  } catch (e) {
    return NextResponse.json({
      counts: { pendingOrders: 0, lowStock: 0, total: 0 },
      recent: []
    });
  }
}
