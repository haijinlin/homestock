type InventoryFiltersProps = {
  categories: string[];
  search: string;
  category: string;
  lowStock: boolean;
};

export function InventoryFilters({
  categories,
  search,
  category,
  lowStock,
}: InventoryFiltersProps) {
  return (
    <form className="grid gap-3 rounded-2xl border bg-white p-4 shadow-card sm:grid-cols-[1fr_180px_auto_auto]">
      <input
        aria-label="Search items"
        className="field mt-0"
        defaultValue={search}
        name="search"
        placeholder="Search by item name..."
      />
      <select
        aria-label="Filter by category"
        className="field mt-0"
        defaultValue={category}
        name="category"
      >
        <option value="">All categories</option>
        {categories.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
      <label className="flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-sm font-medium">
        <input defaultChecked={lowStock} name="lowStock" type="checkbox" value="true" />
        Low stock
      </label>
      <button className="button-primary" type="submit">
        Apply filters
      </button>
    </form>
  );
}
