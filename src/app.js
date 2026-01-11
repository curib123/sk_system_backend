import cors from 'cors';
import express from 'express';
import morgan from 'morgan';

import roleRoutes from './routes/role.route.js';

const app = express();

/* ================= MIDDLEWARES ================= */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

/* ================= ROUTES ================= */
app.use("/api/roles", roleRoutes);

export default app;
