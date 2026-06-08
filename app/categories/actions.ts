"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { assertAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function categoriesError(message: string): never {
  redirect(`/categories?error=${encodeURIComponent(message)}`);
}

export async function createCategory(formData: FormData) {
  await assertAdmin();
  const value = formData.get("name");
  const name = typeof value === "string" ? value.trim() : "";

  if (!name) categoriesError("Category name is required.");
  if (name.length > 50) categoriesError("Category name must be 50 characters or fewer.");

  const existing = await prisma.category.findFirst({
    where: { name: { equals: name } },
    select: { id: true },
  });
  if (existing) categoriesError("That category already exists.");

  await prisma.category.create({ data: { name } });
  revalidatePath("/");
  revalidatePath("/items/new");
  redirect("/categories");
}

export async function deleteCategory(id: number) {
  await assertAdmin();
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) categoriesError("Category not found.");

  const itemsUsingCategory = await prisma.item.count({
    where: { category: category.name },
  });
  if (itemsUsingCategory > 0) {
    categoriesError(
      `Cannot delete ${category.name} because ${itemsUsingCategory} item${itemsUsingCategory === 1 ? "" : "s"} use it.`,
    );
  }

  await prisma.category.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/items/new");
  redirect("/categories");
}
