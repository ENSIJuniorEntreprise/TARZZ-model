const catchAsync = require('../utils/catchAsync');
const { getDashboardStats } = require('../services/dashboard.service');
const { globalSearch } = require('../services/search.service');

const getDashboard = catchAsync(async (_req, res) => {
  const stats = await getDashboardStats();
  res.status(200).json({ success: true, data: stats });
});

const getGlobalSearch = catchAsync(async (req, res) => {
  const data = await globalSearch(req.query.q);
  res.status(200).json({ success: true, data });
});

module.exports = {
  getDashboard,
  getGlobalSearch,
};
