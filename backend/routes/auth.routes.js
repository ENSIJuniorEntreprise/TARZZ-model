const express = require('express');
const { body } = require('express-validator');
const rateLimit = require('express-rate-limit');
const authController = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many login attempts, please try again later.' },
});

router.post(
  '/login',
  loginLimiter,
  [body('email').isEmail().withMessage('Valid email is required'), body('password').isLength({ min: 6 })],
  validate,
  authController.login
);

router.get('/me', protect, authController.me);

module.exports = router;
