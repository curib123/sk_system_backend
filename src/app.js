import cors from 'cors';
import express from 'express';
import morgan from 'morgan';

const app = express();

/* ================= MIDDLEWARES ================= */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

/* ================= ROUTES ================= */

export default app;
