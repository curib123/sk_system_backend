import {
  createClassificationService,
  deleteClassificationService,
  getClassificationByIdService,
  getClassificationsService,
  updateClassificationService,
} from '../services/classification.service.js';

/* ======================================================
   CREATE CLASSIFICATION (REQUIRED LIMIT)
====================================================== */
export const createClassification = async (req, res) => {
  try {
    const data = await createClassificationService(req.body);

    return res.status(201).json({
      success: true,
      message: 'Classification created with budget limit',
      data,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/* ======================================================
   GET ALL CLASSIFICATIONS
====================================================== */
export const getClassifications = async (_req, res) => {
  try {
    const data = await getClassificationsService();

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

/* ======================================================
   GET CLASSIFICATION BY ID
====================================================== */
export const getClassificationById = async (req, res) => {
  try {
    const data = await getClassificationByIdService(req.params.id);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

/* ======================================================
   UPDATE CLASSIFICATION + LIMIT
====================================================== */
export const updateClassification = async (req, res) => {
  try {
    const data = await updateClassificationService(
      Number(req.params.id),
      req.body
    );

    return res.status(200).json({
      success: true,
      message: 'Classification and limit updated successfully',
      data,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


/* ======================================================
   DELETE CLASSIFICATION (SOFT DELETE)
====================================================== */
export const deleteClassification = async (req, res) => {
  try {
    await deleteClassificationService(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Classification deleted successfully',
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
