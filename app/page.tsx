import { Prisma } from "@prisma/client";
import Link from "next/link";
import { InventoryFilters } from "@/components/inventory-filters";
import { ItemCard } from "@/components/item-card";
import { StatCard } from "@/components/stat-card";
import { isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type DashboardProps = {
  searchParams: Promise<{
    search?: string;
    category?: string;
    lowStock?: string;
    admin?: string;
  }>;
};

export default async function Dashboard({ searchParams }: DashboardProps) {
  const params = await searchParams;
  const search = params.search?.trim() ?? "";
  const category = params.category?.trim() ?? "";
  const lowStock = params.lowStock === "true";
  const admin = await isAdmin();

  const where: Prisma.ItemWhereInput = {
    ...(search ? { name: { contains: search } } : {}),
    ...(category ? { category } : {}),
    ...(lowStock ? { quantity: { lte: prisma.item.fields.minStock } } : {}),
  };

  const screenshotMode = process.env.VERCEL !== "1" && process.env.SCREENSHOT_MODE === "true";
  const syntheticItems = [
    { id: 9001, name: "Laundry detergent", category: "Laundry", quantity: 2, unit: "bottles", minStock: 1, location: "Laundry cupboard", imageUrl: null, notes: "Sensitive-skin formula", lastPurchasedAt: new Date("2026-07-08"), createdAt: new Date(), updatedAt: new Date() },
    { id: 9002, name: "Dishwasher tablets", category: "Kitchen", quantity: 8, unit: "tablets", minStock: 10, location: "Under the sink", imageUrl: null, notes: "Add to the next shopping list", lastPurchasedAt: new Date("2026-06-28"), createdAt: new Date(), updatedAt: new Date() },
    { id: 9003, name: "Toilet paper", category: "Bathroom", quantity: 12, unit: "rolls", minStock: 6, location: "Hall cupboard", imageUrl: null, notes: null, lastPurchasedAt: new Date("2026-07-12"), createdAt: new Date(), updatedAt: new Date() },
    { id: 9004, name: "Long-life milk", category: "Pantry", quantity: 3, unit: "cartons", minStock: 2, location: "Pantry shelf", imageUrl: null, notes: "Rotate oldest cartons forward", lastPurchasedAt: new Date("2026-07-10"), createdAt: new Date(), updatedAt: new Date() },
    { id: 9005, name: "AA batteries", category: "Household", quantity: 4, unit: "batteries", minStock: 4, location: "Utility drawer", imageUrl: null, notes: null, lastPurchasedAt: new Date("2026-05-22"), createdAt: new Date(), updatedAt: new Date() },
    { id: 9006, name: "Hand soap refill", category: "Bathroom", quantity: 1, unit: "pouch", minStock: 1, location: "Bathroom cabinet", imageUrl: null, notes: "Fragrance free", lastPurchasedAt: new Date("2026-07-01"), createdAt: new Date(), updatedAt: new Date() },
  ];
  const visibleSyntheticItems = syntheticItems.filter((item) =>
    (!search || item.name.toLowerCase().includes(search.toLowerCase())) &&
    (!category || item.category === category) &&
    (!lowStock || item.quantity <= item.minStock)
  );
  const databaseResults = screenshotMode ? null : await Promise.all([
    prisma.item.findMany({ where, orderBy: [{ name: "asc" }] }),
    prisma.item.count(),
    prisma.item.count({ where: { quantity: { lte: prisma.item.fields.minStock } } }),
    prisma.category.findMany({ select: { name: true }, orderBy: { name: "asc" } }),
  ]);
  const [items, totalItems, lowStockItems, categoryRows] = databaseResults ?? [
    visibleSyntheticItems,
    syntheticItems.length,
    syntheticItems.filter((item) => item.quantity <= item.minStock).length,
    [...new Set(syntheticItems.map((item) => item.category))].sort().map((name) => ({ name })),
  ];

  return (
    <div className="space-y-8">
      {params.admin === "required" ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Sign in with an approved administrator account to manage inventory.
        </div>
      ) : null}

      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-forest">Household inventory</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Know what you have.
          </h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Track everyday supplies and see what needs restocking before it runs out.
          </p>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <StatCard label="Total items" value={totalItems} />
        <StatCard label="Low stock items" value={lowStockItems} tone="warning" />
      </section>

      <InventoryFilters
        categories={categoryRows.map((row) => row.name)}
        search={search}
        category={category}
        lowStock={lowStock}
      />

      {items.length ? (
        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <ItemCard canEdit={admin} item={item} key={item.id} />
          ))}
        </section>
      ) : (
        <section className="rounded-2xl border border-dashed bg-white px-6 py-16 text-center">
          <h2 className="text-xl font-bold">{totalItems ? "No items match these filters" : "Your inventory is empty"}</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
            {totalItems ? "Try changing or clearing the current filters." : "Add your first household supply to start tracking stock."}
          </p>
          {totalItems || admin ? (
            <Link href={totalItems ? "/" : "/items/new"} className="button-primary mt-6">
              {totalItems ? "Clear filters" : "Add first item"}
            </Link>
          ) : null}
        </section>
      )}
    </div>
  );
}
