import {
  createClassificationService,
  deleteClassificationService,
  getClassificationByIdService,
  getClassificationsService,
  updateClassificationService,
} from '../services/classification.service.js';

/* ======================================================
   CREATE
====================================================== */
export const createClassification = async (req, res) => {
  try {
    const data = await createClassificationService(req.body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/* ======================================================
   GET ALL
====================================================== */
export const getClassifications = async (_req, res) => {
  try {
    const data = await getClassificationsService();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ======================================================
   GET BY ID
====================================================== */
export const getClassificationById = async (req, res) => {
  try {
    const data = await getClassificationByIdService(req.params.id);
    res.json({ success: true, data });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

/* ======================================================
   UPDATE
====================================================== */
export const updateClassification = async (req, res) => {
  try {
    const data = await updateClassificationService(
      req.params.id,
      req.body
    );
    res.json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/* ======================================================
   DELETE (SOFT)
====================================================== */
export const deleteClassification = async (req, res) => {
  try {
    await deleteClassificationService(req.params.id);
    res.json({ success: true, message: 'Classification deleted' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
