import cors from 'cors';
import express from 'express';
import morgan from 'morgan';

import authRoutes from './routes/auth.route.js';
import roleRoutes from './routes/role.route.js';

const app = express();

/* ================= MIDDLEWARES ================= */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

/* ================= ROUTES ================= */
app.use("/api/roles", roleRoutes);
app.use('/api/auth', authRoutes);


export default app;
