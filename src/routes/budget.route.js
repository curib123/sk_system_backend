import express from 'express';

import * as budgetController from '../controllers/budget.controller.js';

const router = express.Router();

/* ================= TOTAL BUDGET ROUTES ================= */
router.post('/', budgetController.createBudget);
router.get('/', budgetController.getAllBudgets);
router.get('/:id', budgetController.getBudgetById);
router.put('/:id', budgetController.updateBudget);
router.delete('/:id', budgetController.deleteBudget);

export default router;
