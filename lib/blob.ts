import { del, put } from "@vercel/blob";

const maxImageSize = 2 * 1024 * 1024;
const allowedImageTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

function safeFilename(filename: string) {
  const normalized = filename
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalized || "product-image";
}

export function isManagedBlobUrl(url: string | null) {
  if (!url) return false;

  try {
    const hostname = new URL(url).hostname;
    return (
      hostname.endsWith(".public.blob.vercel-storage.com") ||
      hostname.endsWith(".private.blob.vercel-storage.com")
    );
  } catch {
    return false;
  }
}

export async function uploadProductImage(imageFile: File) {
  if (!allowedImageTypes.includes(imageFile.type)) {
    throw new Error("Upload a JPG, PNG, WebP, or GIF image.");
  }
  if (imageFile.size > maxImageSize) {
    throw new Error("Uploaded image must be 2 MB or smaller.");
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("Image uploads require BLOB_READ_WRITE_TOKEN.");
  }

  const blob = await put(`products/${safeFilename(imageFile.name)}`, imageFile, {
    access: "public",
    addRandomSuffix: true,
    contentType: imageFile.type,
  });

  return blob.url;
}

export async function deleteManagedBlob(url: string | null) {
  if (!url || !isManagedBlobUrl(url) || !process.env.BLOB_READ_WRITE_TOKEN) return;

  try {
    await del(url);
  } catch (error) {
    console.error("Could not delete Vercel Blob image.", error);
  }
}
