const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');

const router = express.Router();

router.post(
  '/login',
  [body('email').isEmail().withMessage('Valid email is required'), body('password').isLength({ min: 6 })],
  validate,
  authController.login
);

router.get('/me', protect, authController.me);

module.exports = router;
