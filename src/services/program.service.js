import { db } from '../config/db.config.js';

/* ======================================================
   CREATE PROGRAM
====================================================== */
export const createProgramService = async (data) => {
  const {
    code,
    name,
    description,
    imageUrl,
    committeeInCharge,
    beneficiaries,
    startDate,
    endDate,
    isActive = true,
  } = data;

  // check unique code
  const existing = await db.program.findFirst({
    where: { code, deletedAt: null },
  });

  if (existing) {
    throw new Error('Program code already exists');
  }

  return db.program.create({
    data: {
      code,
      name,
      description,
      imageUrl,
      committeeInCharge,
      beneficiaries,
      startDate,
      endDate,
      isActive,
    },
  });
};

/* ======================================================
   GET ALL PROGRAMS
====================================================== */
export const getAllProgramsService = async () => {
  return db.program.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: 'desc' },
  });
};

/* ======================================================
   GET PROGRAM BY ID
====================================================== */
export const getProgramByIdService = async (id) => {
  const program = await db.program.findFirst({
    where: { id: Number(id), deletedAt: null },
  });

  if (!program) {
    throw new Error('Program not found');
  }

  return program;
};

/* ======================================================
   UPDATE PROGRAM
====================================================== */
export const updateProgramService = async (id, data) => {
  await getProgramByIdService(id);

  return db.program.update({
    where: { id: Number(id) },
    data,
  });
};

/* ======================================================
   TOGGLE PROGRAM ACTIVE STATUS
====================================================== */
export const toggleProgramStatusService = async (id) => {
  const program = await getProgramByIdService(id);

  return db.program.update({
    where: { id: Number(id) },
    data: { isActive: !program.isActive },
  });
};

/* ======================================================
   SOFT DELETE PROGRAM
====================================================== */
export const deleteProgramService = async (id) => {
  await getProgramByIdService(id);

  return db.program.update({
    where: { id: Number(id) },
    data: { deletedAt: new Date() },
  });
};
