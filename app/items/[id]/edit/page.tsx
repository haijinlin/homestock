import { notFound } from "next/navigation";
import { ItemForm } from "@/components/item-form";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateItem } from "../../actions";

type EditItemPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditItemPage({ params }: EditItemPageProps) {
  await requireAdmin();
  const { id } = await params;
  const itemId = Number(id);
  if (!Number.isInteger(itemId)) notFound();

  const [item, categories] = await Promise.all([
    prisma.item.findUnique({ where: { id: itemId } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);
  if (!item) notFound();

  const updateAction = updateItem.bind(null, item.id);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-widest text-forest">Inventory</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Edit {item.name}</h1>
        <p className="mt-2 text-slate-600">Update the stock level or item details.</p>
      </div>
      <div className="rounded-2xl border bg-white p-5 shadow-card sm:p-8">
        <ItemForm
          action={updateAction}
          categories={categories.map((category) => category.name)}
          item={item}
        />
      </div>
    </div>
  );
}
