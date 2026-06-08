import type { Item } from "@prisma/client";
import Link from "next/link";
import { deleteItem } from "@/app/items/actions";
import { formatDate } from "@/lib/items";
import { ProductImage } from "@/components/product-image";

export function ItemCard({ item, canEdit }: { item: Item; canEdit: boolean }) {
  const isLowStock = item.quantity <= item.minStock;
  const deleteAction = deleteItem.bind(null, item.id);

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border bg-white shadow-card">
      <div className="aspect-[16/9] overflow-hidden border-b bg-white p-4">
        <ProductImage alt={item.name} src={item.imageUrl} />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-forest">
              {item.category}
            </p>
            <h2 className="mt-1 text-lg font-bold">{item.name}</h2>
            <p className="mt-1 text-sm text-slate-500">{item.location}</p>
          </div>
          {isLowStock ? (
            <span className="shrink-0 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-warning">
              Low stock
            </span>
          ) : (
            <span className="shrink-0 rounded-full bg-mint px-2.5 py-1 text-xs font-semibold text-forest">
              In stock
            </span>
          )}
        </div>

        <div className="my-5 rounded-xl bg-canvas p-4">
          <p className="text-3xl font-bold">
            {item.quantity}{" "}
            <span className="text-base font-medium text-slate-500">{item.unit}</span>
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Restock at {item.minStock} or fewer
          </p>
        </div>

        <dl className="space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">Last purchased</dt>
            <dd className="font-medium">{formatDate(item.lastPurchasedAt)}</dd>
          </div>
          {item.notes ? (
            <div className="border-t pt-3">
              <dt className="sr-only">Notes</dt>
              <dd className="line-clamp-2 text-slate-600">{item.notes}</dd>
            </div>
          ) : null}
        </dl>

        {canEdit ? (
          <div className="mt-auto flex gap-2 border-t pt-4">
            <Link href={`/items/${item.id}/edit`} className="button-secondary flex-1">
              Edit
            </Link>
            <form action={deleteAction} className="flex-1">
              <button
                className="w-full rounded-xl px-4 py-2.5 text-sm font-semibold text-warning transition hover:bg-red-50"
                type="submit"
              >
                Delete
              </button>
            </form>
          </div>
        ) : null}
      </div>
    </article>
  );
}
