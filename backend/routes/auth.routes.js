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

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Authenticate the admin and obtain a JWT
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful, returns a JWT
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Invalid credentials
 *       429:
 *         description: Too many login attempts
 */
router.post(
  '/login',
  loginLimiter,
  [body('email').isEmail().withMessage('Valid email is required'), body('password').isLength({ min: 6 })],
  validate,
  authController.login
);

/**
 * @openapi
 * /auth/me:
 *   get:
 *     summary: Get the currently authenticated admin
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Current admin email
 *       401:
 *         description: Missing or invalid token
 */
router.get('/me', protect, authController.me);

module.exports = router;
