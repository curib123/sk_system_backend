import express from 'express';

import {
  createProgram,
  deleteProgram,
  getProgramById,
  getPrograms,
  toggleProgramStatus,
  updateProgram,
} from '../controllers/program.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { uploadProgramImage } from '../middlewares/upload.middleware.js';

const router = express.Router();

/* ======================================================
   PROGRAM ROUTES
====================================================== */

// CREATE PROGRAM (with image upload)
router.post(
  '/',
  authMiddleware,
  uploadProgramImage.single('image'),
  createProgram
);

// GET ALL PROGRAMS
router.get('/', authMiddleware, getPrograms);

// GET PROGRAM BY ID
router.get('/:id', authMiddleware, getProgramById);

// UPDATE PROGRAM
router.put('/:id', authMiddleware, updateProgram);

// TOGGLE PROGRAM STATUS
router.patch(
  '/toggle-status/:id',
  authMiddleware,
  toggleProgramStatus
);

// SOFT DELETE PROGRAM
router.delete('/:id', authMiddleware, deleteProgram);

export default router;
