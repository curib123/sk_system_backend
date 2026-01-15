import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import path from 'path';

import authRoutes from './routes/auth.route.js';
import budgetAllocationRoutes from './routes/budget-allocation.routes.js';
import budgetRoutes from './routes/budget.route.js';
import classificationRoutes from './routes/classification.route.js';
import dashboardRoutes from './routes/dashboard.route.js';
import fiscalYearRoutes from './routes/fiscalYear.route.js';
import objectOfExpenditureRoutes from './routes/objectOfExpenditure.route.js';
import permissionRoutes from './routes/permission.route.js';
import programRoutes from './routes/program.route.js';
import roleRoutes from './routes/role.route.js';
import userRoutes from './routes/user.route.js';

const app = express();

/* ================= MIDDLEWARES ================= */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

/* ================= ROUTES ================= */
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);

app.use('/api/fiscal-years', fiscalYearRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/budget-allocations', budgetAllocationRoutes);

app.use('/api/programs', programRoutes);
app.use('/api/classifications', classificationRoutes);
app.use('/api/objects-of-expenditure', objectOfExpenditureRoutes);
app.use('/api/permissions', permissionRoutes);

/* ================= ROUTES ================= */
app.use('/api/dashboard', dashboardRoutes);

/* ================= STATIC FILES ================= */
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

export default app;
