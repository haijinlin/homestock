import { Prisma } from "@prisma/client";

export type ItemFormState = {
  error?: string;
};

function requiredString(formData: FormData, field: string) {
  const value = formData.get(field);
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${field} is required.`);
  }
  return value.trim();
}

function nonNegativeInteger(formData: FormData, field: string) {
  const raw = requiredString(formData, field);
  const value = Number(raw);
  if (!Number.isInteger(value) || value < 0) {
    throw new Error(`${field} must be a non-negative whole number.`);
  }
  return value;
}

export function itemDataFromForm(formData: FormData): Prisma.ItemCreateInput {
  const notes = formData.get("notes");
  const lastPurchasedAt = formData.get("lastPurchasedAt");

  return {
    name: requiredString(formData, "name"),
    category: requiredString(formData, "category"),
    quantity: nonNegativeInteger(formData, "quantity"),
    unit: requiredString(formData, "unit"),
    minStock: nonNegativeInteger(formData, "minStock"),
    location: requiredString(formData, "location"),
    notes: typeof notes === "string" && notes.trim() ? notes.trim() : null,
    lastPurchasedAt:
      typeof lastPurchasedAt === "string" && lastPurchasedAt
        ? new Date(`${lastPurchasedAt}T00:00:00`)
        : null,
  };
}

export function formatDate(date: Date | null) {
  if (!date) return "Not recorded";
  return new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function dateInputValue(date: Date | null) {
  if (!date) return "";
  return date.toISOString().slice(0, 10);
}
