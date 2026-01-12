import { db } from '../config/db.config.js';

export const getDashboardData = async () => {
  /* ================= FIND ACTIVE FISCAL YEAR ================= */
  let fiscalYear = await db.fiscalYear.findFirst({
    where: {
      isActive: true,
      deletedAt: null,
    },
    orderBy: {
      year: 'desc',
    },
    include: {
      budgets: {
        where: { deletedAt: null },
        include: {
          allocations: {
            where: { deletedAt: null },
            include: {
              program: true,
              classification: true,
              object: true,
            },
          },
        },
      },
    },
  });

  /* ================= FALLBACK: LATEST YEAR WITH BUDGET ================= */
  if (!fiscalYear || fiscalYear.budgets.length === 0) {
    fiscalYear = await db.fiscalYear.findFirst({
      where: {
        deletedAt: null,
        budgets: {
          some: { deletedAt: null },
        },
      },
      orderBy: {
        year: 'desc',
      },
      include: {
        budgets: {
          where: { deletedAt: null },
          include: {
            allocations: {
              where: { deletedAt: null },
              include: {
                program: true,
                classification: true,
                object: true,
              },
            },
          },
        },
      },
    });
  }

  /* ================= HARD FAIL (REAL ERROR) ================= */
  if (!fiscalYear || fiscalYear.budgets.length === 0) {
    throw new Error('No fiscal year with a budget exists');
  }

  const budget = fiscalYear.budgets[0];

  /* ================= BUDGET TOTALS ================= */
  const totalAllocated = budget.allocations.reduce(
    (sum, a) => sum + Number(a.allocatedAmount),
    0
  );

  const totalUsed = budget.allocations.reduce(
    (sum, a) => sum + Number(a.usedAmount),
    0
  );

  const remainingBudget =
    Number(budget.totalAmount) - totalUsed;

  /* ================= PROCUREMENT ANALYTICS ================= */
  const procurementStats = await db.procurementRequest.groupBy({
    by: ['status'],
    where: {
      deletedAt: null,
      allocation: {
        budgetId: budget.id,
      },
    },
    _count: { id: true },
    _sum: { amount: true },
  });

  /* ================= APPROVAL ANALYTICS ================= */
  const approvalStats = await db.approval.groupBy({
    by: ['status'],
    where: {
      deletedAt: null,
      request: {
        allocation: {
          budgetId: budget.id,
        },
      },
    },
    _count: { id: true },
  });

  /* ================= USER ANALYTICS ================= */
  const totalUsers = await db.user.count({
    where: { deletedAt: null },
  });

  const usersByStatus = await db.user.groupBy({
    by: ['status'],
    where: { deletedAt: null },
    _count: { id: true },
  });

  const usersByRole = await db.user.groupBy({
    by: ['roleId'],
    where: { deletedAt: null },
    _count: { id: true },
  });

  /* ================= SYSTEM LOGS ================= */
  const recentLogs = await db.systemLog.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: 'desc' },
    take: 10,
    include: {
      user: {
        select: { id: true, fullName: true },
      },
    },
  });

  const logSummary = await db.systemLog.groupBy({
    by: ['level'],
    _count: { id: true },
  });

  /* ================= FINAL RESPONSE ================= */
  return {
    fiscalYear: {
      id: fiscalYear.id,
      year: fiscalYear.year,
      isActive: fiscalYear.isActive,
    },

    users: {
      total: totalUsers,
      byStatus: usersByStatus,
      byRole: usersByRole,
    },

    budget: {
      id: budget.id,
      total: Number(budget.totalAmount),
      allocated: totalAllocated,
      used: totalUsed,
      remaining: remainingBudget,
      utilizationRate: (
        (totalUsed / Number(budget.totalAmount)) *
        100
      ).toFixed(2),
    },

    procurement: procurementStats,
    approvals: approvalStats,

    logs: {
      recent: recentLogs,
      summary: logSummary,
    },
  };
};
