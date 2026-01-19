// @ts-check
import {PrismaClient} from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

/** @type {import("@prisma/client").PrismaClient} */
const prisma = globalThis.prisma ?? new PrismaClient({
    log: process.env.NODE_ENV === "production" ? ["error"] : ["query", "info", "warn", "error"],
    adapter: new PrismaPg({
        connectionString: process.env.DATABASE_URL,
    }),
});

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}

export default prisma