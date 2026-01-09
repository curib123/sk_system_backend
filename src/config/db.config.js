import { PrismaClient } from '@prisma/client';

/**
 * Prevent multiple Prisma instances in development
 * (important when using nodemon / hot reload)
 */
const globalForPrisma = globalThis;

export const db =
  globalForPrisma.__prisma__ ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "info", "warn", "error"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.__prisma__ = db;
}

/**
 * Gracefully disconnect Prisma on app shutdown
 */
export const disconnectDB = async () => {
  try {
    await db.$disconnect();
    console.log("🛑 Database disconnected");
  } catch (err) {
    console.error("❌ Error disconnecting database", err);
  }
};
