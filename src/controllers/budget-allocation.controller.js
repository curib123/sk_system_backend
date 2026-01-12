import * as budgetAllocationService
  from '../services/budget-allocation.service.js';

/* ================= CREATE ================= */
export const createBudgetAllocation = async (req, res) => {
  try {
    const allocation = await budgetAllocationService.createBudgetAllocation(req.body);

    return res.status(201).json({
      success: true,
      message: 'Budget allocation created successfully',
      data: allocation,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET ALL ================= */
export const getAllBudgetAllocations = async (req, res) => {
  try {
    const data = await budgetAllocationService.getAllBudgetAllocations();

    return res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET BY ID ================= */
export const getBudgetAllocationById = async (req, res) => {
  try {
    const data = await budgetAllocationService.getBudgetAllocationById(
      Number(req.params.id)
    );

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Budget allocation not found',
      });
    }

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= UPDATE ================= */
export const updateBudgetAllocation = async (req, res) => {
  try {
    const data = await budgetAllocationService.updateBudgetAllocation(
      Number(req.params.id),
      req.body
    );

    return res.status(200).json({
      success: true,
      message: 'Budget allocation updated successfully',
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= DELETE ================= */
export const deleteBudgetAllocation = async (req, res) => {
  try {
    await budgetAllocationService.deleteBudgetAllocation(Number(req.params.id));

    return res.status(200).json({
      success: true,
      message: 'Budget allocation deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= REPORT ================= */
export const getProgramBudgetSummary = async (req, res) => {
  try {
    const data = await budgetAllocationService.getProgramBudgetSummary();

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
