import { db } from '../config/db.config.js';

/* ================= HELPERS ================= */
const assertExists = async (model, where, label) => {
  const record = await model.findFirst({ where });
  if (!record) {
    throw new Error(`${label} not found`);
  }
  return record;
};

const assertPositiveAmount = (amount) => {
  if (amount === undefined || amount === null) return;
  if (isNaN(amount) || Number(amount) <= 0) {
    throw new Error('Allocated amount must be a positive number');
  }
};

/* ================= CREATE ================= */
export const createBudgetAllocation = async (payload) => {
  const {
    budgetId,
    programId,
    classificationId,
    objectOfExpenditureId,
    allocatedAmount,
  } = payload;

  /* ---------------- REQUIRED FIELDS ---------------- */
  if (
    !budgetId ||
    !programId ||
    !classificationId ||
    !objectOfExpenditureId ||
    allocatedAmount === undefined
  ) {
    throw new Error('Missing required fields');
  }

  assertPositiveAmount(allocatedAmount);

  /* ---------------- FK VALIDATION ---------------- */
  await assertExists(db.budget, { id: budgetId, deletedAt: null }, 'Budget');
  await assertExists(db.program, { id: programId, deletedAt: null }, 'Program');
  await assertExists(
    db.budgetClassification,
    { id: classificationId, deletedAt: null },
    'Budget classification'
  );
  await assertExists(
    db.objectOfExpenditure,
    { id: objectOfExpenditureId, deletedAt: null },
    'Object of expenditure'
  );

  /* ---------------- CLASSIFICATION LIMIT CHECK ---------------- */
  const classificationLimit = await db.budgetClassificationLimit.findFirst({
    where: {
      budgetId,
      classificationId,
    },
    include: {
      budget: true,
    },
  });

  if (!classificationLimit) {
    throw new Error('Classification limit not found for this budget');
  }

  const allocatedSoFar = await db.budgetAllocation.aggregate({
    where: {
      budgetId,
      classificationId,
      deletedAt: null,
    },
    _sum: { allocatedAmount: true },
  });

  const usedAllocation =
    Number(allocatedSoFar._sum.allocatedAmount || 0);

  const remainingLimit =
    Number(classificationLimit.limitAmount) - usedAllocation;

  if (Number(allocatedAmount) > remainingLimit) {
    throw new Error(
      `Allocated amount exceeds remaining classification limit. Remaining: ${remainingLimit}`
    );
  }

  /* ---------------- CREATE ---------------- */
  return db.budgetAllocation.create({
    data: {
      budgetId,
      programId,
      classificationId,
      objectOfExpenditureId,
      allocatedAmount,
    },
  });
};

/* ================= GET ALL (SEARCH | FILTER | PAGINATION | SORT) ================= */
export const getAllBudgetAllocations = async (params = {}) => {
  const {
    search,
    budgetId,
    programId,
    classificationId,
    objectOfExpenditureId,
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = params;

  /* ================= SAFE PAGINATION ================= */
  const safePage =
    Number.isFinite(page) && page > 0 ? page : 1;

  const safeLimit =
    Number.isFinite(limit) && limit > 0 ? limit : 10;

  const skip = (safePage - 1) * safeLimit;

  /* ================= SAFE SORT ================= */
  const ALLOWED_SORT_FIELDS = [
    'createdAt',
    'allocatedAmount',
  ];

  const safeSortBy = ALLOWED_SORT_FIELDS.includes(sortBy)
    ? sortBy
    : 'createdAt';

  const safeSortOrder =
    sortOrder === 'asc' ? 'asc' : 'desc';

  /* ================= WHERE ================= */
  const where = {
    deletedAt: null,
  };

  if (Number.isFinite(budgetId)) {
    where.budgetId = budgetId;
  }

  if (Number.isFinite(programId)) {
    where.programId = programId;
  }

  if (Number.isFinite(classificationId)) {
    where.classificationId = classificationId;
  }

  if (Number.isFinite(objectOfExpenditureId)) {
    where.objectOfExpenditureId = objectOfExpenditureId;
  }

  if (search && search.trim()) {
    where.OR = [
      { program: { name: { contains: search } } },
      { program: { code: { contains: search } } },
      {
        classification: {
          name: { contains: search },
        },
      },
      {
        classification: {
          code: { contains: search },
        },
      },
      { object: { name: { contains: search } } },
      { object: { code: { contains: search } } },
    ];
  }

  /* ================= QUERY ================= */
  const [data, total] = await Promise.all([
    db.budgetAllocation.findMany({
      where,
      include: {
        budget: { include: { fiscalYear: true } },
        program: true,
        classification: true,
        object: true,
      },
      orderBy: {
        [safeSortBy]: safeSortOrder,
      },
      skip,
      take: safeLimit,
    }),

    db.budgetAllocation.count({ where }),
  ]);

  /* ================= RESPONSE ================= */
  return {
    data,
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages: Math.ceil(total / safeLimit),
    },
  };
};


/* ================= GET BY ID ================= */
export const getBudgetAllocationById = async (id) => {
  if (!id || isNaN(id)) {
    throw new Error('Invalid allocation ID');
  }

  return db.budgetAllocation.findFirst({
    where: { id, deletedAt: null },
    include: {
      budget: true,
      program: true,
      classification: true,
      object: true,
    },
  });
};

/* ================= UPDATE ================= */
export const updateBudgetAllocation = async (id, payload) => {
  if (!id || isNaN(id)) {
    throw new Error('Invalid allocation ID');
  }

  const existing = await assertExists(
    db.budgetAllocation,
    { id, deletedAt: null },
    'Budget allocation'
  );

  /* ---------------- ALLOCATED AMOUNT UPDATE ---------------- */
  if (payload.allocatedAmount !== undefined) {
    assertPositiveAmount(payload.allocatedAmount);

    const classificationLimit = await db.budgetClassificationLimit.findFirst({
      where: {
        budgetId: existing.budgetId,
        classificationId: existing.classificationId,
      },
    });

    if (!classificationLimit) {
      throw new Error('Classification limit not found for this budget');
    }

    const usedAllocations = await db.budgetAllocation.aggregate({
      where: {
        budgetId: existing.budgetId,
        classificationId: existing.classificationId,
        id: { not: id },
        deletedAt: null,
      },
      _sum: { allocatedAmount: true },
    });

    const allocatedByOthers =
      Number(usedAllocations._sum.allocatedAmount || 0);

    const remainingLimit =
      Number(classificationLimit.limitAmount) - allocatedByOthers;

    if (Number(payload.allocatedAmount) > remainingLimit) {
      throw new Error(
        `Allocated amount exceeds remaining classification limit. Remaining: ${remainingLimit}`
      );
    }

    if (
      payload.usedAmount !== undefined &&
      Number(payload.usedAmount) > Number(payload.allocatedAmount)
    ) {
      throw new Error('Used amount cannot exceed allocated amount');
    }
  }

  /* ---------------- USED AMOUNT UPDATE ---------------- */
  if (payload.usedAmount !== undefined) {
    if (Number(payload.usedAmount) < 0) {
      throw new Error('Used amount cannot be negative');
    }

    if (
      payload.allocatedAmount === undefined &&
      Number(payload.usedAmount) > Number(existing.allocatedAmount)
    ) {
      throw new Error('Used amount cannot exceed allocated amount');
    }
  }

  return db.budgetAllocation.update({
    where: { id },
    data: payload,
  });
};

/* ================= DELETE (SOFT) ================= */
export const deleteBudgetAllocation = async (id) => {
  if (!id || isNaN(id)) {
    throw new Error('Invalid allocation ID');
  }

  await assertExists(
    db.budgetAllocation,
    { id, deletedAt: null },
    'Budget allocation'
  );

  return db.budgetAllocation.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
};

/* =====================================================
   REPORT: PROGRAM → CLASSIFICATION → OBJECT TOTALS
===================================================== */
export const getProgramBudgetSummary = async () => {
  const programs = await db.program.findMany({
    where: { deletedAt: null },
    include: {
      allocations: {
        where: { deletedAt: null },
        include: {
          classification: true,
          object: true,
        },
      },
    },
    orderBy: { name: 'asc' },
  });

  return programs.map(program => {
    const classificationMap = {};
    let programAllocated = 0;
    let programUsed = 0;

    program.allocations.forEach(a => {
      const classId = a.classification.id;

      if (!classificationMap[classId]) {
        classificationMap[classId] = {
          classificationId: a.classification.id,
          classificationCode: a.classification.code,
          classificationName: a.classification.name,
          totalAllocated: 0,
          totalUsed: 0,
          objects: [],
        };
      }

      const allocated = Number(a.allocatedAmount);
      const used = Number(a.usedAmount);

      classificationMap[classId].totalAllocated += allocated;
      classificationMap[classId].totalUsed += used;

      classificationMap[classId].objects.push({
        objectId: a.object.id,
        objectCode: a.object.code,
        objectName: a.object.name,
        allocatedAmount: allocated,
        usedAmount: used,
      });

      programAllocated += allocated;
      programUsed += used;
    });

    return {
      programId: program.id,
      programCode: program.code,
      programName: program.name,
      totalAllocated: programAllocated,
      totalUsed: programUsed,
      classifications: Object.values(classificationMap),
    };
  });
};
