import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

/* ================= CONNECT DB ================= */
const connectDB = async () => {
  try {
    await db.$connect();
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Failed to connect to database:", error);
    process.exit(1);
  }
};

/* ================= DISCONNECT DB ================= */
const disconnectDB = async () => {
  try {
    await db.$disconnect();
    console.log("🛑 Database disconnected");
  } catch (error) {
    console.error("❌ Error disconnecting database:", error);
  }
};

export { connectDB, db, disconnectDB };
