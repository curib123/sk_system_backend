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
/* ======================================================
   GET ALL PROGRAMS (SEARCH, FILTER, SORT, PAGINATION)
====================================================== */
export const getAllProgramsService = async (query) => {
  const {
    q,
    isActive,
    startDateFrom,
    startDateTo,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    page = 1,
    limit = 10,
  } = query;

  const where = {
    deletedAt: null,

    ...(isActive !== undefined && {
      isActive: isActive === 'true',
    }),

    ...(q && {
      OR: [
        { code: { contains: q } },
        { name: { contains: q } },
        { description: { contains: q } },
        { committeeInCharge: { contains: q } },
        { beneficiaries: { contains: q } },
      ],
    }),

    ...((startDateFrom || startDateTo) && {
      startDate: {
        ...(startDateFrom && { gte: new Date(startDateFrom) }),
        ...(startDateTo && { lte: new Date(startDateTo) }),
      },
    }),
  };

  const skip = (Number(page) - 1) * Number(limit);

  const [data, total] = await Promise.all([
    db.program.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: Number(limit),
    }),
    db.program.count({ where }),
  ]);

  return {
    data,
    meta: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    },
  };
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
