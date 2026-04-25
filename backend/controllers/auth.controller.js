const catchAsync = require('../utils/catchAsync');
const authService = require('../services/auth.service');

const login = catchAsync(async (req, res) => {
  const data = await authService.login(req.body);
  res.status(200).json({ success: true, ...data });
});

const me = catchAsync(async (req, res) => {
  res.status(200).json({ success: true, email: req.user.email });
});

module.exports = { login, me };
