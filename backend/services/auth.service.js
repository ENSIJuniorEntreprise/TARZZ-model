const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const env = require('../config/env');
const Admin = require('../models/Admin');
const ApiError = require('../utils/ApiError');

const login = async ({ email, password }) => {
  const normalizedEmail = String(email).trim().toLowerCase();
  const admin = await Admin.findOne({ email: normalizedEmail }).select('+password');

  if (!admin) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const isValidPassword = await bcrypt.compare(password, admin.password);
  if (!isValidPassword) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const token = jwt.sign(
    { sub: admin._id.toString(), email: admin.email, role: 'admin' },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );

  return {
    token,
    admin: {
      id: admin._id,
      email: admin.email,
    },
  };
};

const seedDefaultAdmin = async () => {
  const existing = await Admin.findOne({ email: env.adminEmail.toLowerCase() });
  if (existing) return existing;

  return await Admin.create({
    email: env.adminEmail.toLowerCase(),
    password: env.adminPassword,
  });
};

module.exports = {
  login,
  seedDefaultAdmin,
};
