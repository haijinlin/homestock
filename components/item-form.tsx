"use client";

import type { Item } from "@prisma/client";
import Link from "next/link";
import { useActionState } from "react";
import { dateInputValue, type ItemFormState } from "@/lib/items";

type ItemFormProps = {
  action: (state: ItemFormState, formData: FormData) => Promise<ItemFormState>;
  categories: string[];
  item?: Item;
};

const initialState: ItemFormState = {};

export function ItemForm({ action, categories, item }: ItemFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-6">
      {state.error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="sm:col-span-2">
          <span className="text-sm font-semibold">Item name</span>
          <input
            className="field"
            name="name"
            defaultValue={item?.name}
            placeholder="Laundry detergent"
            required
          />
        </label>

        <label>
          <span className="text-sm font-semibold">Category</span>
          <select className="field" name="category" defaultValue={item?.category ?? ""} required>
            <option value="" disabled>
              Select a category
            </option>
            {categories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
          <Link href="/categories" className="mt-2 inline-block text-xs font-semibold text-forest hover:underline">
            Manage categories
          </Link>
        </label>

        <label>
          <span className="text-sm font-semibold">Storage location</span>
          <input
            className="field"
            name="location"
            defaultValue={item?.location}
            placeholder="Laundry cupboard"
            required
          />
        </label>

        <label>
          <span className="text-sm font-semibold">Current quantity</span>
          <input
            className="field"
            name="quantity"
            type="number"
            min="0"
            step="1"
            defaultValue={item?.quantity ?? 0}
            required
          />
        </label>

        <label>
          <span className="text-sm font-semibold">Unit</span>
          <input
            className="field"
            name="unit"
            defaultValue={item?.unit}
            placeholder="bottles, rolls, packs..."
            required
          />
        </label>

        <label>
          <span className="text-sm font-semibold">Minimum stock level</span>
          <input
            className="field"
            name="minStock"
            type="number"
            min="0"
            step="1"
            defaultValue={item?.minStock ?? 1}
            required
          />
        </label>

        <label>
          <span className="text-sm font-semibold">Last purchased</span>
          <input
            className="field"
            name="lastPurchasedAt"
            type="date"
            defaultValue={dateInputValue(item?.lastPurchasedAt ?? null)}
          />
        </label>

        <fieldset className="space-y-4 rounded-xl border bg-canvas p-4 sm:col-span-2">
          <legend className="px-1 text-sm font-semibold">Product image</legend>
          {item?.imageUrl ? (
            <div className="flex items-center gap-4">
              <div className="h-24 w-24 overflow-hidden rounded-xl border bg-white p-2">
                <img
                  alt={item.name}
                  className="h-full w-full object-contain"
                  src={item.imageUrl}
                />
              </div>
              <label className="flex items-center gap-2 text-sm font-medium">
                <input name="removeImage" type="checkbox" value="true" />
                Remove current image
              </label>
            </div>
          ) : null}

          <label className="block">
            <span className="text-sm font-semibold">
              {item?.imageUrl ? "Upload replacement image" : "Upload image"}
            </span>
            <input
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="field file:mr-3 file:rounded-lg file:border-0 file:bg-mint file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-forest"
              name="imageFile"
              type="file"
            />
            <span className="mt-2 block text-xs text-slate-500">
              Optional. JPG, PNG, WebP, or GIF up to 2 MB. Uploads are stored in
              Vercel Blob.
            </span>
          </label>

          <label className="block">
            <span className="text-sm font-semibold">Or use an image URL</span>
            <input
              className="field"
              name="imageUrl"
              type="url"
              defaultValue={
                item?.imageUrl?.startsWith("http://") ||
                item?.imageUrl?.startsWith("https://")
                  ? item.imageUrl
                  : ""
              }
              placeholder="https://example.com/product-image.jpg"
            />
          </label>
        </fieldset>

        <label className="sm:col-span-2">
          <span className="text-sm font-semibold">Notes</span>
          <textarea
            className="field min-h-28 resize-y"
            name="notes"
            defaultValue={item?.notes ?? ""}
            placeholder="Brand, preferred size, or anything useful..."
          />
        </label>
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Link href="/" className="button-secondary">
          Cancel
        </Link>
        <button className="button-primary" disabled={pending} type="submit">
          {pending ? "Saving..." : item ? "Save changes" : "Add item"}
        </button>
      </div>
    </form>
  );
}
