import { db } from '../config/db.config.js';

/* ======================================================
   CREATE CLASSIFICATION
====================================================== */
export const createClassificationService = async (data) => {
  const { code, name, description } = data;

  const exists = await db.budgetClassification.findFirst({
    where: {
      OR: [{ code }, { name }],
      deletedAt: null,
    },
  });

  if (exists) {
    throw new Error('Classification code or name already exists');
  }

  return db.budgetClassification.create({
    data: { code, name, description },
  });
};

/* ======================================================
   GET ALL CLASSIFICATIONS
====================================================== */
export const getClassificationsService = async () => {
  return db.budgetClassification.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: 'desc' },
  });
};

/* ======================================================
   GET CLASSIFICATION BY ID
====================================================== */
export const getClassificationByIdService = async (id) => {
  const classification = await db.budgetClassification.findFirst({
    where: { id: Number(id), deletedAt: null },
  });

  if (!classification) {
    throw new Error('Classification not found');
  }

  return classification;
};

/* ======================================================
   UPDATE CLASSIFICATION
====================================================== */
export const updateClassificationService = async (id, data) => {
  const exists = await db.budgetClassification.findFirst({
    where: { id: Number(id), deletedAt: null },
  });

  if (!exists) {
    throw new Error('Classification not found');
  }

  return db.budgetClassification.update({
    where: { id: Number(id) },
    data,
  });
};

/* ======================================================
   DELETE CLASSIFICATION (SOFT DELETE)
====================================================== */
export const deleteClassificationService = async (id) => {
  const exists = await db.budgetClassification.findFirst({
    where: { id: Number(id), deletedAt: null },
  });

  if (!exists) {
    throw new Error('Classification not found');
  }

  return db.budgetClassification.update({
    where: { id: Number(id) },
    data: { deletedAt: new Date() },
  });
};
