import * as procurementService from '../services/procurement.service.js';

/* ================= CREATE REQUEST ================= */
export const createRequest = async (req, res) => {
  try {
    const data = await procurementService.createRequest(
      req.body,
      req.user.id
    );

    return res.status(201).json({
      success: true,
      message: 'Procurement request created successfully',
      data,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= UPDATE REQUEST ================= */
export const updateRequest = async (req, res) => {
  try {
    const data = await procurementService.updateRequest(
      Number(req.params.id),
      req.body
    );

    return res.json({
      success: true,
      message: 'Procurement request updated successfully',
      data,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= SUBMIT REQUEST ================= */
export const submitRequest = async (req, res) => {
  try {
    const data = await procurementService.submitRequest(
      Number(req.params.id)
    );

    return res.json({
      success: true,
      message: 'Procurement request submitted',
      data,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= APPROVE REQUEST ================= */
export const approveRequest = async (req, res) => {
  try {
    const data = await procurementService.approveRequest(
      Number(req.params.id),
      req.user.id,
      req.body.remarks
    );

    return res.json({
      success: true,
      message: 'Procurement request approved',
      data,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= REJECT REQUEST ================= */
export const rejectRequest = async (req, res) => {
  try {
    const data = await procurementService.rejectRequest(
      Number(req.params.id),
      req.user.id,
      req.body.remarks
    );

    return res.json({
      success: true,
      message: 'Procurement request rejected',
      data,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= MARK AS PURCHASED ================= */
export const markPurchased = async (req, res) => {
  try {
    const data = await procurementService.markPurchased(
      Number(req.params.id)
    );

    return res.json({
      success: true,
      message: 'Procurement request marked as purchased',
      data,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= COMPLETE REQUEST ================= */
export const completeRequest = async (req, res) => {
  try {
    const data = await procurementService.completeRequest(
      Number(req.params.id)
    );

    return res.json({
      success: true,
      message: 'Procurement request completed',
      data,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= UPLOAD PROOF ================= */
export const uploadProof = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'File is required',
      });
    }

    const data = await procurementService.uploadProof(
      {
        requestId: Number(req.body.requestId),
        type: req.body.type,
        description: req.body.description,
        fileUrl: `/uploads/procurement/${req.file.filename}`,
      },
      req.user.id
    );

    return res.status(201).json({
      success: true,
      message: 'Proof uploaded successfully',
      data,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET ALL REQUESTS ================= */
export const getAllRequests = async (req, res) => {
  try {
    const data = await procurementService.getAllRequests();

    return res.json({
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

/* ================= DELETE REQUEST (SOFT) ================= */
export const deleteRequest = async (req, res) => {
  try {
    await procurementService.deleteRequest(Number(req.params.id));

    return res.json({
      success: true,
      message: 'Procurement request deleted successfully',
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
