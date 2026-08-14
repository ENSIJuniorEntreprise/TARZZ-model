const dotenv = require('dotenv');

dotenv.config();

const nodeEnv = process.env.NODE_ENV || 'development';

if (nodeEnv === 'production' && !process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET must be explicitly set in production (no default allowed).');
}
if (nodeEnv === 'production' && !process.env.ADMIN_PASSWORD) {
  throw new Error('ADMIN_PASSWORD must be explicitly set in production (no default allowed).');
}

module.exports = {
  nodeEnv,
  port: Number(process.env.PORT || 3001),
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/tarzz_bijouterie',
  jwtSecret: process.env.JWT_SECRET || 'change-me-super-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  adminEmail: process.env.ADMIN_EMAIL || 'admin@hajtajeb.com',
  adminPassword: process.env.ADMIN_PASSWORD || 'admin123',
  frontendOrigin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
  rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000),
  rateLimitMax: Number(process.env.RATE_LIMIT_MAX || 200),
};
