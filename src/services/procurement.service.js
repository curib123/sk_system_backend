import { db } from '../config/db.config.js';

/* ================= CREATE REQUEST ================= */
export const createRequest = async (data, userId) => {
  return await db.procurementRequest.create({
    data: {
      title: data.title,
      description: data.description ?? null,
      amount: data.amount,
      allocationId: data.allocationId,
      vendorId: data.vendorId ?? null,
      createdById: userId,
      items: {
        create: data.items ?? [],
      },
    },
    include: {
      items: true,
      allocation: true,
    },
  });
};

/* ================= UPDATE REQUEST ================= */
export const updateRequest = async (id, data) => {
  const request = await db.procurementRequest.findFirst({
    where: { id, deletedAt: null },
  });

  if (!request) throw new Error('Request not found');

  if (request.status !== 'DRAFT') {
    throw new Error('Only draft requests can be updated');
  }

  return await db.procurementRequest.update({
    where: { id },
    data,
  });
};

/* ================= SUBMIT REQUEST ================= */
export const submitRequest = async (id) => {
  const request = await db.procurementRequest.findFirst({
    where: { id, deletedAt: null },
  });

  if (!request) throw new Error('Request not found');

  if (request.status !== 'DRAFT') {
    throw new Error('Only draft requests can be submitted');
  }

  return await db.procurementRequest.update({
    where: { id },
    data: { status: 'SUBMITTED' },
  });
};

/* ================= APPROVE REQUEST ================= */
export const approveRequest = async (requestId, approverId, remarks) => {
  return await db.$transaction(async (tx) => {
    const request = await tx.procurementRequest.findFirst({
      where: { id: requestId, deletedAt: null },
      include: { allocation: true },
    });

    if (!request) throw new Error('Request not found');

    if (request.status !== 'SUBMITTED') {
      throw new Error('Only submitted requests can be approved');
    }

    const remaining =
      request.allocation.allocatedAmount - request.allocation.usedAmount;

    if (request.amount > remaining) {
      throw new Error('Insufficient budget allocation');
    }

    await tx.approval.create({
      data: {
        requestId,
        approverId,
        remarks: remarks ?? null,
        status: 'APPROVED',
      },
    });

    return await tx.procurementRequest.update({
      where: { id: requestId },
      data: { status: 'APPROVED' },
    });
  });
};

/* ================= REJECT REQUEST ================= */
export const rejectRequest = async (requestId, approverId, remarks) => {
  return await db.$transaction(async (tx) => {
    const request = await tx.procurementRequest.findFirst({
      where: { id: requestId, deletedAt: null },
    });

    if (!request) throw new Error('Request not found');

    if (request.status !== 'SUBMITTED') {
      throw new Error('Only submitted requests can be rejected');
    }

    await tx.approval.create({
      data: {
        requestId,
        approverId,
        remarks: remarks ?? null,
        status: 'REJECTED',
      },
    });

    return await tx.procurementRequest.update({
      where: { id: requestId },
      data: { status: 'REJECTED' },
    });
  });
};

/* ================= MARK AS PURCHASED ================= */
export const markPurchased = async (requestId) => {
  const request = await db.procurementRequest.findFirst({
    where: { id: requestId, deletedAt: null },
  });

  if (!request) throw new Error('Request not found');

  if (request.status !== 'APPROVED') {
    throw new Error('Only approved requests can be marked as purchased');
  }

  return await db.procurementRequest.update({
    where: { id: requestId },
    data: { status: 'PURCHASED' },
  });
};

/* ================= COMPLETE REQUEST ================= */
export const completeRequest = async (requestId) => {
  return await db.$transaction(async (tx) => {
    const request = await tx.procurementRequest.findFirst({
      where: { id: requestId, deletedAt: null },
      include: { allocation: true },
    });

    if (!request) throw new Error('Request not found');

    if (request.status !== 'PURCHASED') {
      throw new Error('Only purchased requests can be completed');
    }

    await tx.budgetAllocation.update({
      where: { id: request.allocationId },
      data: {
        usedAmount: {
          increment: request.amount,
        },
      },
    });

    return await tx.procurementRequest.update({
      where: { id: requestId },
      data: { status: 'COMPLETED' },
    });
  });
};

/* ================= UPLOAD PROOF ================= */
export const uploadProof = async (data, userId) => {
  const request = await db.procurementRequest.findFirst({
    where: { id: data.requestId, deletedAt: null },
  });

  if (!request) throw new Error('Request not found');

  return await db.procurementProof.create({
    data: {
      requestId: data.requestId,
      type: data.type,
      fileUrl: data.fileUrl,
      description: data.description ?? null,
      uploadedById: userId,
    },
  });
};

/* ================= GET ALL ================= */
export const getAllRequests = async () => {
  return await db.procurementRequest.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: 'desc' },
    include: {
      items: true,
      approvals: true,
      proofs: true,
      vendor: true,
      allocation: true,
      createdBy: true,
    },
  });
};

/* ================= SOFT DELETE ================= */
export const deleteRequest = async (id) => {
  const request = await db.procurementRequest.findFirst({
    where: { id, deletedAt: null },
  });

  if (!request) throw new Error('Request not found');

  if (request.status !== 'DRAFT') {
    throw new Error('Only draft requests can be deleted');
  }

  return await db.procurementRequest.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
};
