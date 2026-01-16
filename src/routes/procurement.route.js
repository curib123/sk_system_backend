import { Router } from 'express';

import {
  approveRequest,
  completeRequest,
  createRequest,
  deleteRequest,
  getAllRequests,
  getDraftRequest,
  markPurchased,
  rejectRequest,
  submitRequest,
  updateRequest,
  uploadProof,
} from '../controllers/procurement.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import {
  uploadProofMiddleware,
} from '../middlewares/upload-proof.middleware.js';

const router = Router();

/* =========================
   AUTHENTICATED ROUTES
========================= */

// Create procurement request
router.post(
  '/',
  authMiddleware,
  createRequest
);

// Update procurement request (DRAFT only)
router.put(
  '/:id',
  authMiddleware,
  updateRequest
);

// Submit request
router.patch(
  '/:id/submit',
  authMiddleware,
  submitRequest
);

// Approve request
router.patch(
  '/:id/approve',
  authMiddleware,
  approveRequest
);

// Reject request
router.patch(
  '/:id/reject',
  authMiddleware,
  rejectRequest
);

// Mark as purchased
router.patch(
  '/:id/purchase',
  authMiddleware,
  markPurchased
);

// Complete request
router.patch(
  '/:id/complete',
  authMiddleware,
  completeRequest
);

// Get all requests
router.get(
  '/',
  authMiddleware,
  getAllRequests
);

// Soft delete request (DRAFT only)
router.delete(
  '/:id',
  authMiddleware,
  deleteRequest
);

router.get(
  '/:id/draft',
  authMiddleware,
  getDraftRequest
);

/* =========================
   FILE UPLOAD (AUTH FIRST!)
========================= */

router.post(
  '/upload-proof',
  authMiddleware, // ⚠️ MUST COME BEFORE MULTER
  uploadProofMiddleware.single('file'),
  uploadProof
);

export default router;
