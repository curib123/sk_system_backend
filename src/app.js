import cors from 'cors';
import express from 'express';
import morgan from 'morgan';

import { errorHandler } from './middlewares/error.middleware.js';
import routes from './routes/index.js';

const app = express();

/* ================= MIDDLEWARES ================= */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

/* ================= ROUTES ================= */
app.use("/api", routes);

/* ================= ERROR HANDLER ================= */
app.use(errorHandler);

export default app;
