import dotenv from 'dotenv';

import app from './app.js';
import {
  db,
  disconnectDB,
} from './config/db.config.js';

dotenv.config();

const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || "development";

/* ================= START SERVER ================= */
const startServer = async () => {
  try {
    /* Connect DB FIRST */
    await db.$connect();
    console.log("✅ Database connected successfully");

    const server = app.listen(PORT, () => {
      console.log(
        `🚀 sk_system_backend running on port ${PORT} [${NODE_ENV}]`
      );
    });

    /* Graceful shutdown */
    const shutdown = async (signal) => {
      console.log(`${signal} received. Shutting down...`);
      await disconnectDB();
      server.close(() => process.exit(0));
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
