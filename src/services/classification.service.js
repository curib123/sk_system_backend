import { db } from '../config/db.config.js';

/* ======================================================
   CREATE CLASSIFICATION (REQUIRED LIMIT + REMAINING CHECK)
====================================================== */
export const createClassificationService = async (data) => {
  const {
    code,
    name,
    description,
    budgetId,
    limitAmount,
  } = data;

  /* ================= BASIC VALIDATION ================= */
  if (
    typeof code !== 'string' ||
    typeof name !== 'string' ||
    !code.trim() ||
    !name.trim()
  ) {
    throw new Error('Code and name are required');
  }

  if (!Number.isInteger(Number(budgetId))) {
    throw new Error('Invalid budgetId');
  }

  if (
    limitAmount === undefined ||
    !Number.isFinite(Number(limitAmount))
  ) {
    throw new Error('Invalid limit amount');
  }

  if (Number(limitAmount) <= 0) {
    throw new Error('Limit amount must be greater than zero');
  }

  if (
    description !== undefined &&
    description !== null &&
    typeof description !== 'string'
  ) {
    throw new Error('Invalid description');
  }

  /* ================= DUPLICATE CHECK ================= */
  const exists = await db.budgetClassification.findFirst({
    where: {
      OR: [
        { code: code.trim() },
        { name: name.trim() },
      ],
      deletedAt: null,
    },
  });

  if (exists) {
    throw new Error(
      'Classification code or name already exists'
    );
  }

  /* ================= BUDGET CHECK ================= */
  const budget = await db.budget.findFirst({
    where: {
      id: Number(budgetId),
      deletedAt: null,
    },
  });

  if (!budget) {
    throw new Error('Budget not found');
  }

  /* ================= TOTAL BUDGET VALIDATION (NEW) ================= */
  if (Number(limitAmount) > Number(budget.totalAmount)) {
    throw new Error(
      `Limit amount cannot exceed total budget amount (${Number(
        budget.totalAmount
      )})`
    );
  }

  /* ================= REMAINING BUDGET CHECK ================= */
  const usedLimits =
    await db.budgetClassificationLimit.aggregate({
      where: { budgetId: Number(budgetId) },
      _sum: { limitAmount: true },
    });

  const remainingBudget =
    Number(budget.totalAmount) -
    Number(usedLimits._sum.limitAmount || 0);

  if (Number(limitAmount) > remainingBudget) {
    throw new Error(
      `Limit amount exceeds remaining budget. Remaining budget: ${remainingBudget}`
    );
  }

  /* ================= TRANSACTION ================= */
  return db.$transaction(async (tx) => {
    const classification =
      await tx.budgetClassification.create({
        data: {
          code: code.trim(),
          name: name.trim(),
          description: description?.trim() || null,
        },
      });

    const limit =
      await tx.budgetClassificationLimit.create({
        data: {
          budgetId: Number(budgetId),
          classificationId: classification.id,
          limitAmount: Number(limitAmount),
        },
      });

    return { ...classification, limit };
  });
};

/* ======================================================
   GET ALL CLASSIFICATIONS (WITH LIMITS)
====================================================== */
export const getClassificationsService = async () => {
  return db.budgetClassification.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: 'desc' },
    include: {
      budgetLimits: {
        include: {
          budget: {
            select: {
              id: true,
              totalAmount: true,
            },
          },
        },
      },
    },
  });
};

/* ======================================================
   GET CLASSIFICATION BY ID (WITH LIMIT)
====================================================== */
export const getClassificationByIdService = async (id) => {
  if (!Number.isInteger(Number(id))) {
    throw new Error('Invalid classification id');
  }

  const classification =
    await db.budgetClassification.findFirst({
      where: { id: Number(id), deletedAt: null },
      include: {
        budgetLimits: {
          include: {
            budget: {
              select: {
                id: true,
                totalAmount: true,
              },
            },
          },
        },
      },
    });

  if (!classification) {
    throw new Error('Classification not found');
  }

  return classification;
};

/* ======================================================
   UPDATE CLASSIFICATION + UPDATE LIMIT (RETURN BOTH)
====================================================== */
export const updateClassificationService = async (id, data) => {
  if (!Number.isInteger(Number(id))) {
    throw new Error('Invalid classification id');
  }

  if (!data || Object.keys(data).length === 0) {
    throw new Error('No data provided for update');
  }

  const classification =
    await db.budgetClassification.findFirst({
      where: { id: Number(id), deletedAt: null },
      include: {
        budgetLimits: {
          include: { budget: true },
        },
      },
    });

  if (!classification) {
    throw new Error('Classification not found');
  }

  const currentLimit = classification.budgetLimits[0];
  if (!currentLimit) {
    throw new Error('Classification limit not found');
  }

  /* ================= CODE CHANGE RULE ================= */
  if (
    data.code &&
    classification.budgetLimits.length > 0
  ) {
    throw new Error(
      'Cannot change classification code while it is used in budget limits'
    );
  }

  /* ================= DUPLICATE CHECK ================= */
  if (data.code || data.name) {
    const duplicate =
      await db.budgetClassification.findFirst({
        where: {
          OR: [
            data.code
              ? { code: data.code.trim() }
              : undefined,
            data.name
              ? { name: data.name.trim() }
              : undefined,
          ].filter(Boolean),
          deletedAt: null,
          NOT: { id: Number(id) },
        },
      });

    if (duplicate) {
      throw new Error(
        'Classification code or name already exists'
      );
    }
  }

  /* ================= LIMIT VALIDATION ================= */
  if (data.limitAmount !== undefined) {
    if (
      !Number.isFinite(Number(data.limitAmount)) ||
      Number(data.limitAmount) <= 0
    ) {
      throw new Error(
        'Limit amount must be greater than zero'
      );
    }

    const usedLimits =
      await db.budgetClassificationLimit.aggregate({
        where: {
          budgetId: currentLimit.budgetId,
          classificationId: { not: Number(id) },
        },
        _sum: { limitAmount: true },
      });

    const remainingBudget =
      Number(currentLimit.budget.totalAmount) -
      Number(usedLimits._sum.limitAmount || 0);

    if (Number(data.limitAmount) > remainingBudget) {
      throw new Error(
        `Limit amount exceeds remaining budget. Remaining budget: ${remainingBudget}`
      );
    }
  }

  /* ================= TRANSACTION ================= */
  return db.$transaction(async (tx) => {
    const updatedClassification =
      await tx.budgetClassification.update({
        where: { id: Number(id) },
        data: {
          ...(data.code && { code: data.code.trim() }),
          ...(data.name && { name: data.name.trim() }),
          ...(data.description !== undefined && {
            description:
              data.description?.trim() || null,
          }),
        },
      });

    let updatedLimit = currentLimit;

    if (data.limitAmount !== undefined) {
      updatedLimit =
        await tx.budgetClassificationLimit.update({
          where: { id: currentLimit.id },
          data: {
            limitAmount: Number(data.limitAmount),
          },
        });
    }

    return {
      ...updatedClassification,
      limit: updatedLimit,
    };
  });
};

/* ======================================================
   DELETE CLASSIFICATION (SOFT DELETE)
====================================================== */
export const deleteClassificationService = async (id) => {
  if (!Number.isInteger(Number(id))) {
    throw new Error('Invalid classification id');
  }

  const classification =
    await db.budgetClassification.findFirst({
      where: { id: Number(id), deletedAt: null },
      include: {
        allocations: true,
        budgetLimits: true,
      },
    });

  if (!classification) {
    throw new Error('Classification not found');
  }

  if (classification.allocations.length > 0) {
    throw new Error(
      'Cannot delete classification with existing budget allocations'
    );
  }

  if (classification.budgetLimits.length > 0) {
    throw new Error(
      'Cannot delete classification with existing budget limits'
    );
  }

  return db.budgetClassification.update({
    where: { id: Number(id) },
    data: { deletedAt: new Date() },
  });
};
