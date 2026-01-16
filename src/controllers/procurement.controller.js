import * as procurementService from '../services/procurement.service.js';

/* ================= HELPERS ================= */
const toNumber = (v, name = 'id') => {
  const n = Number(v);
  if (!Number.isFinite(n)) {
    throw new Error(`Invalid ${name}`);
  }
  return n;
};

/* ================= CREATE REQUEST ================= */
export const createRequest = async (req, res) => {
  try {
    const userId = toNumber(req.user.id, 'userId');

    const payload = {
      title: req.body.title,
      description: req.body.description ?? null,
      amount: req.body.amount != null
        ? toNumber(req.body.amount, 'amount')
        : undefined, // service may auto-calc
      allocationId: toNumber(req.body.allocationId, 'allocationId'),
      vendorId: req.body.vendorId
        ? toNumber(req.body.vendorId, 'vendorId')
        : null,
      items: req.body.items, // 🔥 service normalizes
    };

    const data = await procurementService.createRequest(payload, userId);

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
    const id = toNumber(req.params.id, 'requestId');

    const payload = {
      title: req.body.title,
      description: req.body.description ?? null,
      amount: toNumber(req.body.amount, 'amount'),
    };

    const data = await procurementService.updateRequest(id, payload);

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
    const id = toNumber(req.params.id, 'requestId');

    const data = await procurementService.submitRequest(id);

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
    const requestId = toNumber(req.params.id, 'requestId');
    const approverId = toNumber(req.user.id, 'approverId');

    const data = await procurementService.approveRequest(
      requestId,
      approverId,
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
    const requestId = toNumber(req.params.id, 'requestId');
    const approverId = toNumber(req.user.id, 'approverId');

    const data = await procurementService.rejectRequest(
      requestId,
      approverId,
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
    const id = toNumber(req.params.id, 'requestId');

    const data = await procurementService.markPurchased(id);

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
    const id = toNumber(req.params.id, 'requestId');

    const data = await procurementService.completeRequest(id);

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
      throw new Error('File is required');
    }

    const payload = {
      requestId: toNumber(req.body.requestId, 'requestId'),
      type: req.body.type,
      description: req.body.description ?? null,
      fileUrl: `/uploads/procurement/${req.file.filename}`,
    };

    const data = await procurementService.uploadProof(
      payload,
      toNumber(req.user.id, 'userId')
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
    const result = await procurementService.getAllRequests({
      q: typeof req.query.q === 'string' ? req.query.q : '',
      status:
        typeof req.query.status === 'string'
          ? req.query.status
          : undefined,
      page: toNumber(req.query.page ?? 1, 'page'),
      limit: toNumber(req.query.limit ?? 10, 'limit'),
    });

    return res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


/* ================= DELETE REQUEST ================= */
export const deleteRequest = async (req, res) => {
  try {
    const id = toNumber(req.params.id, 'requestId');

    await procurementService.deleteRequest(id);

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

export const getDraftRequest = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const data = await procurementService.getDraftRequestById(id);

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};
