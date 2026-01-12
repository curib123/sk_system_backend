import { db } from '../config/db.config.js';

export const getDashboardOverview = async () => {
  /* ================= ACTIVE FISCAL YEAR ================= */
  const activeFiscalYear = await db.fiscalYear.findFirst({
    where: { isActive: true },
  });

  /* ================= USERS ================= */
  const userStats = await db.user.groupBy({
    by: ['status'],
    _count: { status: true },
  });

  /* ================= PROGRAMS ================= */
  const totalPrograms = await db.program.count({
    where: { deletedAt: null },
  });

  /* ================= BUDGET ================= */
  const budgets = await db.budget.aggregate({
    _sum: { totalAmount: true },
  });

  const allocations = await db.budgetAllocation.aggregate({
    _sum: {
      allocatedAmount: true,
      usedAmount: true,
    },
  });

  /* ================= PROCUREMENT ================= */
  const procurementStats = await db.procurementRequest.groupBy({
    by: ['status'],
    _count: { status: true },
    _sum: { amount: true },
  });

  const pendingApprovals = await db.approval.count({
    where: { status: 'PENDING' },
  });

  /* ================= CHART: REQUEST PER PROGRAM ================= */
  const requestPerProgram = await db.procurementRequest.groupBy({
    by: ['allocationId'],
    _count: true,
  });

  /* ================= RECENT ACTIVITIES ================= */
  const recentRequests = await db.procurementRequest.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      createdBy: { select: { fullName: true } },
      allocation: {
        include: { program: { select: { name: true } } },
      },
    },
  });

  const recentLogs = await db.systemLog.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { fullName: true } },
    },
  });

  return {
    fiscalYear: activeFiscalYear,

    kpis: {
      users: userStats,
      totalPrograms,
      totalBudget: budgets._sum.totalAmount || 0,
      totalAllocated: allocations._sum.allocatedAmount || 0,
      totalUsed: allocations._sum.usedAmount || 0,
      remainingBudget:
        (allocations._sum.allocatedAmount || 0) -
        (allocations._sum.usedAmount || 0),
      pendingApprovals,
    },

    procurement: {
      byStatus: procurementStats,
    },

    activity: {
      recentRequests,
      recentLogs,
    },
  };
};
