import * as procurementService from '../services/procurement.service.js';

/* ================= RESPONSE HELPERS ================= */
const sendSuccess = (res, status = 200, payload = {}) => {
  return res.status(status).json({
    success: true,
    ...payload,
  });
};

const sendError = (res, error) => {
  return res.status(error.statusCode || 400).json({
    success: false,
    message: error.message,
    code: error.code || 'BAD_REQUEST',
    details: error.details ?? null,
  });
};

/* ================= CREATE REQUEST ================= */
export const createRequest = async (req, res) => {
  try {
    const data = await procurementService.createRequest(
      req.body,
      req.user.id
    );

    return sendSuccess(res, 201, {
      message: 'Procurement request created successfully',
      data,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

/* ================= UPDATE REQUEST ================= */
export const updateRequest = async (req, res) => {
  try {
    const data = await procurementService.updateRequest(
      req.params.id,
      req.body
    );

    return sendSuccess(res, 200, {
      message: 'Procurement request updated successfully',
      data,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

/* ================= SUBMIT REQUEST ================= */
export const submitRequest = async (req, res) => {
  try {
    const data = await procurementService.submitRequest(req.params.id);

    return sendSuccess(res, 200, {
      message: 'Procurement request submitted',
      data,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

/* ================= APPROVE REQUEST ================= */
export const approveRequest = async (req, res) => {
  try {
    const data = await procurementService.approveRequest(
      req.params.id,
      req.user.id,
      req.body.remarks
    );

    return sendSuccess(res, 200, {
      message: 'Procurement request approved',
      data,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

/* ================= REJECT REQUEST ================= */
export const rejectRequest = async (req, res) => {
  try {
    const data = await procurementService.rejectRequest(
      req.params.id,
      req.user.id,
      req.body.remarks
    );

    return sendSuccess(res, 200, {
      message: 'Procurement request rejected',
      data,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

/* ================= MARK AS PURCHASED ================= */
export const markPurchased = async (req, res) => {
  try {
    const data = await procurementService.markPurchased(req.params.id);

    return sendSuccess(res, 200, {
      message: 'Procurement request marked as purchased',
      data,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

/* ================= COMPLETE REQUEST ================= */
export const completeRequest = async (req, res) => {
  try {
    const data = await procurementService.completeRequest(req.params.id);

    return sendSuccess(res, 200, {
      message: 'Procurement request completed',
      data,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

/* ================= UPLOAD PROOF ================= */
export const uploadProof = async (req, res) => {
  try {
    if (!req.file) {
      throw {
        message: 'File is required',
        statusCode: 400,
        code: 'FILE_REQUIRED',
      };
    }

    const payload = {
      requestId: req.body.requestId,
      type: req.body.type,
      description: req.body.description ?? null,
      fileUrl: `/uploads/procurement/${req.file.filename}`,
    };

    const data = await procurementService.uploadProof(
      payload,
      req.user.id
    );

    return sendSuccess(res, 201, {
      message: 'Proof uploaded successfully',
      data,
    });
  } catch (error) {
    return sendError(res, error);
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
      page: req.query.page,
      limit: req.query.limit,
    });

    return sendSuccess(res, 200, result);
  } catch (error) {
    return sendError(res, error);
  }
};

/* ================= DELETE REQUEST ================= */
export const deleteRequest = async (req, res) => {
  try {
    await procurementService.deleteRequest(req.params.id);

    return sendSuccess(res, 200, {
      message: 'Procurement request deleted successfully',
    });
  } catch (error) {
    return sendError(res, error);
  }
};

/* ================= GET DRAFT REQUEST ================= */
export const getDraftRequest = async (req, res) => {
  try {
    const data = await procurementService.getDraftRequestById(
      req.params.id
    );

    return sendSuccess(res, 200, { data });
  } catch (error) {
    return sendError(res, error);
  }
};
