import { db } from '../config/db.config.js';

/* ================= HELPERS ================= */
const toNumber = (v, name = 'id') => {
  const n = Number(v);
  if (!Number.isFinite(n)) {
    throw new Error(`Invalid ${name}`);
  }
  return n;
};

const normalizeItems = (items = []) => {
  if (!Array.isArray(items)) return [];

  return items
    .filter(i => i && typeof i === 'object')
    .map(i => {
      const quantity = Math.max(1, Number(i.quantity) || 1);
      const unitCost = Math.max(0, Number(i.unitCost ?? i.unitPrice) || 0);

      return {
        name: i.name?.trim(),
        description: i.description ?? null,
        quantity,
        unitCost,
        totalPrice: quantity * unitCost,
      };
    })
    .filter(i => i.name);
};

/* ================= CREATE REQUEST ================= */
export const createRequest = async (data, userId) => {
  const allocationId = toNumber(data.allocationId, 'allocationId');
  const items = normalizeItems(data.items);

  if (!items.length) {
    throw new Error('At least one procurement item is required');
  }

  // 🔒 Safer: auto-compute amount from items
  const computedAmount = items.reduce(
    (sum, i) => sum + i.totalPrice,
    0
  );

  const amount = data.amount != null
    ? toNumber(data.amount, 'amount')
    : computedAmount;

  return db.procurementRequest.create({
    data: {
      title: data.title,
      description: data.description ?? null,
      amount,
      allocationId,
      vendorId: data.vendorId
        ? toNumber(data.vendorId, 'vendorId')
        : null,
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
  id = toNumber(id, 'requestId');

  const request = await db.procurementRequest.findFirst({
    where: { id, deletedAt: null },
  });

  if (!request) throw new Error('Request not found');
  if (request.status !== 'DRAFT') {
    throw new Error('Only draft requests can be updated');
  }

  return db.procurementRequest.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description ?? null,
      amount: toNumber(data.amount, 'amount'),
    },
  });
};

/* ================= SUBMIT REQUEST ================= */
export const submitRequest = async (id) => {
  id = toNumber(id, 'requestId');

  const request = await db.procurementRequest.findFirst({
    where: { id, deletedAt: null },
  });

  if (!request) throw new Error('Request not found');
  if (request.status !== 'DRAFT') {
    throw new Error('Only draft requests can be submitted');
  }

  return db.procurementRequest.update({
    where: { id },
    data: { status: 'SUBMITTED' },
  });
};

/* ================= APPROVE REQUEST ================= */
export const approveRequest = async (requestId, approverId, remarks) => {
  requestId = toNumber(requestId, 'requestId');
  approverId = toNumber(approverId, 'approverId');

  return db.$transaction(async (tx) => {
    const request = await tx.procurementRequest.findFirst({
      where: { id: requestId, deletedAt: null },
      include: { allocation: true },
    });

    if (!request) throw new Error('Request not found');
    if (request.status !== 'SUBMITTED') {
      throw new Error('Only submitted requests can be approved');
    }

    const remaining =
      request.allocation.allocatedAmount -
      request.allocation.usedAmount;

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

    return tx.procurementRequest.update({
      where: { id: requestId },
      data: { status: 'APPROVED' },
    });
  });
};

/* ================= REJECT REQUEST ================= */
export const rejectRequest = async (requestId, approverId, remarks) => {
  requestId = toNumber(requestId, 'requestId');
  approverId = toNumber(approverId, 'approverId');

  return db.$transaction(async (tx) => {
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

    return tx.procurementRequest.update({
      where: { id: requestId },
      data: { status: 'REJECTED' },
    });
  });
};

/* ================= MARK AS PURCHASED ================= */
export const markPurchased = async (requestId) => {
  requestId = toNumber(requestId, 'requestId');

  const request = await db.procurementRequest.findFirst({
    where: { id: requestId, deletedAt: null },
  });

  if (!request) throw new Error('Request not found');
  if (request.status !== 'APPROVED') {
    throw new Error('Only approved requests can be marked as purchased');
  }

  return db.procurementRequest.update({
    where: { id: requestId },
    data: { status: 'PURCHASED' },
  });
};

/* ================= COMPLETE REQUEST ================= */
export const completeRequest = async (requestId) => {
  requestId = toNumber(requestId, 'requestId');

  return db.$transaction(async (tx) => {
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

    return tx.procurementRequest.update({
      where: { id: requestId },
      data: { status: 'COMPLETED' },
    });
  });
};

/* ================= UPLOAD PROOF ================= */
export const uploadProof = async (data, userId) => {
  const requestId = toNumber(data.requestId, 'requestId');

  const request = await db.procurementRequest.findFirst({
    where: { id: requestId, deletedAt: null },
  });

  if (!request) throw new Error('Request not found');

  return db.procurementProof.create({
    data: {
      requestId,
      type: data.type,
      fileUrl: data.fileUrl,
      description: data.description ?? null,
      uploadedById: toNumber(userId, 'userId'),
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

  const VALID_STATUSES = [
    'DRAFT',
    'SUBMITTED',
    'APPROVED',
    'REJECTED',
    'PURCHASED',
    'COMPLETED',
  ];

  const where = {
    deletedAt: null,
  };

  if (q) {
    where.title = { contains: q };
  }

  if (status) {
    if (!VALID_STATUSES.includes(status)) {
      throw new Error('Invalid request status');
    }
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
  id = toNumber(id, 'requestId');

  const request = await db.procurementRequest.findFirst({
    where: { id, deletedAt: null },
  });

  if (!request) throw new Error('Request not found');
  if (request.status !== 'DRAFT') {
    throw new Error('Only draft requests can be deleted');
  }

  return db.procurementRequest.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
};

/* ================= GET DRAFT REQUEST BY ID ================= */
export const getDraftRequestById = async (id) => {
  id = toNumber(id, 'requestId');

  const request = await db.procurementRequest.findFirst({
    where: {
      id,
      status: 'DRAFT',
      deletedAt: null,
    },
    include: {
      items: true,
      allocation: true,
      vendor: true,
      createdBy: true,
    },
  });

  if (!request) {
    throw new Error('Draft procurement request not found');
  }

  return request;
};
