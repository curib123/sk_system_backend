import * as dashboardService from '../services/dashboard.service.js';

export const getDashboardOverview = async (req, res) => {
  try {
    const data = await dashboardService.getDashboardOverview();

    return res.status(200).json({
      success: true,
      data,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Dashboard Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to load dashboard data',
    });
  }
};
