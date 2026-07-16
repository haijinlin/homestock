import { redirect } from "next/navigation";
import { auth } from "@/auth";

export async function isAdmin() {
  if (process.env.VERCEL !== "1" && process.env.SCREENSHOT_MODE === "true") return false;
  const session = await auth();
  return session?.user?.isAdmin === true;
}

export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/?admin=required");
}

export async function assertAdmin() {
  if (process.env.VERCEL !== "1" && process.env.SCREENSHOT_MODE === "true") {
    throw new Error("Screenshot mode is read-only.");
  }
  if (!(await isAdmin())) throw new Error("Administrator access required.");
}
