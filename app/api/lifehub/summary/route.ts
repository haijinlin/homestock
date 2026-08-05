import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hasValidLifeHubSummaryRequest, lifeHubSummaryIsConfigured } from "@/lib/lifehub-summary-auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!lifeHubSummaryIsConfigured()) {
    return NextResponse.json({ error: "LifeHub summary access is not configured." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
  if (!(await hasValidLifeHubSummaryRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: { "Cache-Control": "no-store" } });
  }

  const lowStockWhere = { quantity: { lte: prisma.item.fields.minStock } };
  const [lowStockCount, items] = await Promise.all([
    prisma.item.count({ where: lowStockWhere }),
    prisma.item.findMany({
      where: lowStockWhere,
      orderBy: [{ quantity: "asc" }, { name: "asc" }],
      take: 6,
      select: { id: true, name: true, quantity: true, unit: true },
    }),
  ]);

  return NextResponse.json({
    module: "homestock",
    updatedAt: new Date().toISOString(),
    counts: { overdue: 0, today: 0, upcoming: 0, needsAttention: lowStockCount },
    actions: items.map((item) => ({
      id: String(item.id),
      title: `${item.name} is low (${item.quantity} ${item.unit})`,
      priority: item.quantity === 0 ? "high" : "medium",
      href: "/?lowStock=true",
    })),
  }, { headers: { "Cache-Control": "private, no-store, max-age=0" } });
}
