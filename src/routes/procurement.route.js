import { Router } from 'express';

import {
  createRequest,
  updateRequest,
  submitRequest,
  approveRequest,
  rejectRequest,
  markPurchased,
  completeRequest,
  getAllRequests,
  deleteRequest,
  uploadProof,
} from '../controllers/procurement.controller.js';

import { uploadProofMiddleware } from '../middlewares/upload-proof.middleware.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

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
