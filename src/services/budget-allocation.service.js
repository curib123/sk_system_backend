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

  /* Required fields */
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

  /* Foreign key validation */
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

/* ================= GET ALL ================= */
export const getAllBudgetAllocations = async () => {
  return db.budgetAllocation.findMany({
    where: { deletedAt: null },
    include: {
      budget: true,
      program: true,
      classification: true,
      object: true,
    },
    orderBy: { createdAt: 'desc' },
  });
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

  if (payload.allocatedAmount !== undefined) {
    assertPositiveAmount(payload.allocatedAmount);

    if (payload.usedAmount > payload.allocatedAmount) {
      throw new Error('Used amount cannot exceed allocated amount');
    }
  }

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
