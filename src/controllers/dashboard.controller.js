import * as dashboardService from '../services/dashboard.service.js';

export const getDashboard = async (req, res) => {
  try {
    const data = await dashboardService.getDashboardData();

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('❌ Dashboard Error:', error);

    // Known business logic errors
    if (
      error.message === 'No fiscal year with a budget exists' ||
      error.message === 'No active fiscal year set'
    ) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    // Unexpected / system errors
    return res.status(500).json({
      success: false,
      message: 'Dashboard service error',
    });
  }
};
