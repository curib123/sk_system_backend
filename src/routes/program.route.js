import express from 'express';

import {
  createProgram,
  deleteProgram,
  getProgramById,
  getPrograms,
  toggleProgramStatus,
  updateProgram,
} from '../controllers/program.controller.js';

const router = express.Router();

router.post('/', createProgram);
router.get('/', getPrograms);
router.get('/:id', getProgramById);
router.put('/:id', updateProgram);
router.patch('/toggle-status/:id', toggleProgramStatus);
router.delete('/:id', deleteProgram);

export default router;
