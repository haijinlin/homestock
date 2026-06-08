"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { assertAdmin } from "@/lib/auth";
import { deleteManagedBlob, uploadProductImage } from "@/lib/blob";
import { prisma } from "@/lib/prisma";
import { itemDataFromForm, type ItemFormState } from "@/lib/items";

function imageUrlFromForm(formData: FormData) {
  const value = formData.get("imageUrl");
  const imageUrl = typeof value === "string" ? value.trim() : "";
  if (!imageUrl) return null;

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(imageUrl);
  } catch {
    throw new Error("Image URL must be a valid URL.");
  }
  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    throw new Error("Image URL must start with http:// or https://.");
  }
  return imageUrl;
}

async function imageValueFromForm(formData: FormData, existingImage: string | null) {
  const imageFile = formData.get("imageFile");
  if (imageFile instanceof File && imageFile.size > 0) {
    const url = await uploadProductImage(imageFile);
    return { url, uploadedBlobUrl: url };
  }

  if (formData.get("removeImage") === "true") {
    return { url: null, uploadedBlobUrl: null };
  }
  const externalImageUrl = imageUrlFromForm(formData);
  if (externalImageUrl) return { url: externalImageUrl, uploadedBlobUrl: null };
  return { url: existingImage, uploadedBlobUrl: null };
}

async function validatedItemData(formData: FormData, existingImage: string | null = null) {
  const data = itemDataFromForm(formData);
  const category = await prisma.category.findUnique({
    where: { name: data.category },
    select: { id: true },
  });

  if (!category) throw new Error("Please select an existing category.");
  const image = await imageValueFromForm(formData, existingImage);
  return {
    data: {
      ...data,
      imageUrl: image.url,
    },
    uploadedBlobUrl: image.uploadedBlobUrl,
  };
}

export async function createItem(
  _previousState: ItemFormState,
  formData: FormData,
): Promise<ItemFormState> {
  await assertAdmin();
  let newImageUrl: string | null = null;

  try {
    const result = await validatedItemData(formData);
    const data = result.data;
    newImageUrl = result.uploadedBlobUrl;
    await prisma.item.create({ data });
  } catch (error) {
    await deleteManagedBlob(newImageUrl);
    return {
      error: error instanceof Error ? error.message : "Could not create item.",
    };
  }

  revalidatePath("/");
  redirect("/");
}

export async function updateItem(
  id: number,
  _previousState: ItemFormState,
  formData: FormData,
): Promise<ItemFormState> {
  await assertAdmin();
  let newImageUrl: string | null = null;

  try {
    const item = await prisma.item.findUnique({
      where: { id },
      select: { imageUrl: true },
    });
    if (!item) throw new Error("Item not found.");

    const result = await validatedItemData(formData, item.imageUrl);
    const data = result.data;
    newImageUrl = result.uploadedBlobUrl;

    await prisma.item.update({
      where: { id },
      data,
    });

    if (item.imageUrl !== data.imageUrl) await deleteManagedBlob(item.imageUrl);
  } catch (error) {
    await deleteManagedBlob(newImageUrl);
    return {
      error: error instanceof Error ? error.message : "Could not update item.",
    };
  }

  revalidatePath("/");
  redirect("/");
}

export async function deleteItem(id: number) {
  await assertAdmin();
  const item = await prisma.item.delete({
    where: { id },
    select: { imageUrl: true },
  });
  await deleteManagedBlob(item.imageUrl);
  revalidatePath("/");
}
