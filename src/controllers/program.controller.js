import * as ProgramService from '../services/program.service.js';

/* ======================================================
   CREATE
====================================================== */
export const createProgram = async (req, res) => {
  try {
    const imageUrl = req.file
      ? `/uploads/programs/${req.file.filename}`
      : null;

    const program = await ProgramService.createProgramService({
      ...req.body,
      imageUrl,
    });

    res.status(201).json({ success: true, data: program });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};


/* ======================================================
   GET ALL
====================================================== */
export const getPrograms = async (req, res) => {
  try {
    const programs = await ProgramService.getAllProgramsService();
    res.json({ success: true, data: programs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ======================================================
   GET BY ID
====================================================== */
export const getProgramById = async (req, res) => {
  try {
    const program = await ProgramService.getProgramByIdService(req.params.id);
    res.json({ success: true, data: program });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

/* ======================================================
   UPDATE
====================================================== */
export const updateProgram = async (req, res) => {
  try {
    const program = await ProgramService.updateProgramService(
      req.params.id,
      req.body
    );
    res.json({ success: true, data: program });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/* ======================================================
   TOGGLE STATUS
====================================================== */
export const toggleProgramStatus = async (req, res) => {
  try {
    const program = await ProgramService.toggleProgramStatusService(
      req.params.id
    );
    res.json({ success: true, data: program });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/* ======================================================
   DELETE (SOFT)
====================================================== */
export const deleteProgram = async (req, res) => {
  try {
    await ProgramService.deleteProgramService(req.params.id);
    res.json({ success: true, message: 'Program deleted successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
