import { ItemForm } from "@/components/item-form";
import { prisma } from "@/lib/prisma";
import { createItem } from "../actions";

export const dynamic = "force-dynamic";

export default async function NewItemPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-widest text-forest">Inventory</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Add a household item</h1>
        <p className="mt-2 text-slate-600">Record where it lives and when it is time to restock.</p>
      </div>
      <div className="rounded-2xl border bg-white p-5 shadow-card sm:p-8">
        <ItemForm action={createItem} categories={categories.map((category) => category.name)} />
      </div>
    </div>
  );
}
