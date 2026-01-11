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

router.post('/', authMiddleware,uploadProgramImage.single('image'),createProgram);
router.get('/', authMiddleware, getPrograms);
router.get('/:id', authMiddleware, getProgramById);
router.put('/:id', authMiddleware, updateProgram);
router.patch('/toggle-status/:id',authMiddleware,toggleProgramStatus);
router.delete('/:id', authMiddleware, deleteProgram);

export default router;
