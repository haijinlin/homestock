import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createCategory, deleteCategory } from "./actions";

type CategoriesPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function CategoriesPage({ searchParams }: CategoriesPageProps) {
  await requireAdmin();
  const { error } = await searchParams;
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  const usage = await prisma.item.groupBy({
    by: ["category"],
    _count: { category: true },
  });
  const usageByName = new Map(usage.map((row) => [row.category, row._count.category]));

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-widest text-forest">Settings</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Manage categories</h1>
        <p className="mt-2 text-slate-600">
          Add categories that match how you organize supplies at home.
        </p>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <form action={createCategory} className="flex flex-col gap-3 rounded-2xl border bg-white p-5 shadow-card sm:flex-row">
        <label className="flex-1">
          <span className="text-sm font-semibold">New category</span>
          <input className="field" name="name" maxLength={50} placeholder="Pet supplies" required />
        </label>
        <button className="button-primary sm:self-end" type="submit">
          Add category
        </button>
      </form>

      <section className="overflow-hidden rounded-2xl border bg-white shadow-card">
        {categories.length ? (
          <ul className="divide-y">
            {categories.map((category) => {
              const count = usageByName.get(category.name) ?? 0;
              return (
                <li className="flex items-center justify-between gap-4 px-5 py-4" key={category.id}>
                  <div>
                    <p className="font-semibold">{category.name}</p>
                    <p className="text-sm text-slate-500">
                      {count} {count === 1 ? "item" : "items"}
                    </p>
                  </div>
                  <form action={deleteCategory.bind(null, category.id)}>
                    <button
                      className="rounded-xl px-3 py-2 text-sm font-semibold text-warning transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                      disabled={count > 0}
                      title={count > 0 ? "Move items to another category before deleting" : "Delete category"}
                      type="submit"
                    >
                      Delete
                    </button>
                  </form>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="px-5 py-10 text-center text-sm text-slate-500">No categories yet.</p>
        )}
      </section>
    </div>
  );
}
