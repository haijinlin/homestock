import { redirect } from "next/navigation";
import { auth } from "@/auth";

export async function isAdmin() {
  const session = await auth();
  return session?.user?.isAdmin === true;
}

export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/?admin=required");
}

export async function assertAdmin() {
  if (!(await isAdmin())) throw new Error("Administrator access required.");
}
