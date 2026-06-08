import { Prisma } from "@prisma/client";
import Link from "next/link";
import { InventoryFilters } from "@/components/inventory-filters";
import { ItemCard } from "@/components/item-card";
import { StatCard } from "@/components/stat-card";
import { prisma } from "@/lib/prisma";

type DashboardProps = {
  searchParams: Promise<{
    search?: string;
    category?: string;
    lowStock?: string;
  }>;
};

export default async function Dashboard({ searchParams }: DashboardProps) {
  const params = await searchParams;
  const search = params.search?.trim() ?? "";
  const category = params.category?.trim() ?? "";
  const lowStock = params.lowStock === "true";

  const where: Prisma.ItemWhereInput = {
    ...(search ? { name: { contains: search } } : {}),
    ...(category ? { category } : {}),
    ...(lowStock ? { quantity: { lte: prisma.item.fields.minStock } } : {}),
  };

  const [items, totalItems, lowStockItems, categoryRows] = await Promise.all([
    prisma.item.findMany({ where, orderBy: [{ name: "asc" }] }),
    prisma.item.count(),
    prisma.item.count({ where: { quantity: { lte: prisma.item.fields.minStock } } }),
    prisma.category.findMany({ select: { name: true }, orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="space-y-8">
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
            <ItemCard item={item} key={item.id} />
          ))}
        </section>
      ) : (
        <section className="rounded-2xl border border-dashed bg-white px-6 py-16 text-center">
          <h2 className="text-xl font-bold">{totalItems ? "No items match these filters" : "Your inventory is empty"}</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
            {totalItems ? "Try changing or clearing the current filters." : "Add your first household supply to start tracking stock."}
          </p>
          <Link href={totalItems ? "/" : "/items/new"} className="button-primary mt-6">
            {totalItems ? "Clear filters" : "Add first item"}
          </Link>
        </section>
      )}
    </div>
  );
}
