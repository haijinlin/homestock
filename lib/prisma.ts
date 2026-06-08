import { PrismaClient as PostgresPrismaClient } from "@prisma/client";
import { PrismaClient as LocalPrismaClient } from "../node_modules/@prisma/local-client";

const globalForPrisma = globalThis as unknown as {
  prisma: PostgresPrismaClient | undefined;
};

const PrismaClient = process.env.DATABASE_URL?.startsWith("file:")
  ? (LocalPrismaClient as typeof PostgresPrismaClient)
  : PostgresPrismaClient;

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
