import * as ProgramService from '../services/program.service.js';

/* ======================================================
   CREATE
====================================================== */
export const createProgram = async (req, res) => {
  try {
    const imageUrl = req.file
      ? `/uploads/programs/${req.file.filename}`
      : null;

    // ✅ convert form-data strings → correct types
    const startDate = req.body.startDate
      ? new Date(req.body.startDate)
      : null;

    const endDate = req.body.endDate
      ? new Date(req.body.endDate)
      : null;

    const isActive =
      req.body.isActive !== undefined
        ? req.body.isActive === 'true'
        : true;

    const program = await ProgramService.createProgramService({
      code: req.body.code,
      name: req.body.name,
      description: req.body.description,
      imageUrl,
      committeeInCharge: req.body.committeeInCharge,
      beneficiaries: req.body.beneficiaries,
      startDate,
      endDate,
      isActive,
    });

    res.status(201).json({
      success: true,
      data: program,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


/* ======================================================
   GET ALL
====================================================== */
export const getPrograms = async (req, res) => {
  try {
    const result = await ProgramService.getAllProgramsService(req.query);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/* ======================================================
   GET BY ID
====================================================== */
export const getProgramById = async (req, res) => {
  try {
    const program = await ProgramService.getProgramByIdService(req.params.id);
    res.status(200).json({
      success: true,
      data: program,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

/* ======================================================
   UPDATE (supports image replace)
====================================================== */
export const updateProgram = async (req, res) => {
  try {
    const imageUrl = req.file
      ? `/uploads/programs/${req.file.filename}`
      : undefined; // IMPORTANT: undefined so it won't overwrite

    const updateData = {
      ...req.body,
      ...(imageUrl && { imageUrl }),
    };

    const program = await ProgramService.updateProgramService(
      req.params.id,
      updateData
    );

    res.status(200).json({
      success: true,
      data: program,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
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

    res.status(200).json({
      success: true,
      data: program,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/* ======================================================
   DELETE (SOFT)
====================================================== */
export const deleteProgram = async (req, res) => {
  try {
    await ProgramService.deleteProgramService(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Program deleted successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
