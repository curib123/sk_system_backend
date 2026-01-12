import { Router } from 'express';

import * as procurementController
  from '../controllers/procurement.controller.js';
import {
  uploadProofMiddleware,
} from '../middlewares/upload-proof.middleware.js';

const router = Router();

/* ================= PROCUREMENT REQUESTS ================= */

// Create procurement request
router.post(
  '/',
  procurementController.createRequest
);

// Update procurement request (DRAFT only)
router.put(
  '/:id',
  procurementController.updateRequest
);

// Submit request
router.patch(
  '/:id/submit',
  procurementController.submitRequest
);

// Approve request
router.patch(
  '/:id/approve',
  procurementController.approveRequest
);

// Reject request
router.patch(
  '/:id/reject',
  procurementController.rejectRequest
);

// Mark as purchased
router.patch(
  '/:id/purchase',
  procurementController.markPurchased
);

// Complete request
router.patch(
  '/:id/complete',
  procurementController.completeRequest
);

// Get all requests
router.get(
  '/',
  procurementController.getAllRequests
);

// Soft delete request (DRAFT only)
router.delete(
  '/:id',
  procurementController.deleteRequest
);

/* ================= FILE UPLOAD ================= */

// Upload procurement proof
router.post(
  '/upload-proof',
  uploadProofMiddleware.single('file'),
  procurementController.uploadProof
);

export default router;
