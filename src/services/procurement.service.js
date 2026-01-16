import { db } from '../config/db.config.js';

/* ================= HELPERS ================= */
const toNumber = (v, name = 'id') => {
  const n = Number(v);
  if (Number.isNaN(n)) throw new Error(`Invalid ${name}`);
  return n;
};

const normalizeItems = (items = []) => {
  if (!Array.isArray(items)) return [];

  return items
    .filter(i => i && typeof i === 'object')
    .map(i => ({
      name: i.name?.trim(),
      description: i.description ?? null,
      quantity: Number(i.quantity) || 1,
      unitPrice: Number(i.unitPrice) || 0,
      totalPrice:
        (Number(i.quantity) || 1) * (Number(i.unitPrice) || 0),
    }))
    .filter(i => i.name); // remove empty rows
};

/* ================= CREATE REQUEST ================= */
export const createRequest = async (data, userId) => {
  const allocationId = toNumber(data.allocationId, 'allocationId');
  const items = normalizeItems(data.items);

  return await db.procurementRequest.create({
    data: {
      title: data.title,
      description: data.description ?? null,
      amount: Number(data.amount),
      allocationId,
      vendorId: data.vendorId ? toNumber(data.vendorId, 'vendorId') : null,
      createdById: toNumber(userId, 'userId'),
      items: {
        create: items,
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
  id = toNumber(id);

  const request = await db.procurementRequest.findFirst({
    where: { id, deletedAt: null },
  });

  if (!request) throw new Error('Request not found');
  if (request.status !== 'DRAFT') {
    throw new Error('Only draft requests can be updated');
  }

  return await db.procurementRequest.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description ?? null,
      amount: Number(data.amount),
    },
  });
};

/* ================= SUBMIT REQUEST ================= */
export const submitRequest = async (id) => {
  id = toNumber(id);

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
  requestId = toNumber(requestId);
  approverId = toNumber(approverId);

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
  requestId = toNumber(requestId);
  approverId = toNumber(approverId);

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
  requestId = toNumber(requestId);

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
  requestId = toNumber(requestId);

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
        usedAmount: { increment: request.amount },
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
  const requestId = toNumber(data.requestId);

  const request = await db.procurementRequest.findFirst({
    where: { id: requestId, deletedAt: null },
  });

  if (!request) throw new Error('Request not found');

  return await db.procurementProof.create({
    data: {
      requestId,
      type: data.type,
      fileUrl: data.fileUrl,
      description: data.description ?? null,
      uploadedById: toNumber(userId),
    },
  });
};

/* ================= GET ALL REQUESTS ================= */
export const getAllRequests = async ({
  q = '',
  status,
  page = 1,
  limit = 10,
}) => {
  page = toNumber(page, 'page');
  limit = toNumber(limit, 'limit');

  const where = { deletedAt: null };

  if (q) {
    where.title = { contains: q };
  }

  if (status) {
    where.status = status;
  }

  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    db.procurementRequest.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        items: true,
        approvals: true,
        proofs: true,
        vendor: true,
        allocation: true,
        createdBy: true,
      },
    }),
    db.procurementRequest.count({ where }),
  ]);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/* ================= SOFT DELETE ================= */
export const deleteRequest = async (id) => {
  id = toNumber(id);

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
