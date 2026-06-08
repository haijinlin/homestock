import { PrismaClient as LocalPrismaClient } from "@prisma/client";
import { PrismaClient as PostgresPrismaClient } from "../node_modules/@prisma/postgres-client";

const globalForPrisma = globalThis as unknown as {
  prisma: LocalPrismaClient | undefined;
};

const PrismaClient = process.env.DATABASE_URL?.startsWith("file:")
  ? LocalPrismaClient
  : (PostgresPrismaClient as typeof LocalPrismaClient);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
