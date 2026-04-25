const express = require('express');
const { body, param } = require('express-validator');
const orderController = require('../controllers/order.controller');
const { protect } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');

const router = express.Router();

router.use(protect);

router.get('/', orderController.getOrders);

router.post(
  '/',
  [
    body('client').isMongoId().withMessage('Valid client id is required'),
    body('date').optional().isISO8601(),
    body('products').isArray({ min: 1 }).withMessage('At least one order line is required'),
    body('products.*.product').isMongoId().withMessage('Valid product id is required'),
    body('products.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be >= 1'),
    body('status').optional().isIn(['pending', 'in_progress', 'delivered']),
  ],
  validate,
  orderController.createOrder
);

router.put(
  '/:id/status',
  [
    param('id').isMongoId().withMessage('Invalid order id'),
    body('status').isIn(['pending', 'in_progress', 'delivered']).withMessage('Invalid status'),
  ],
  validate,
  orderController.updateOrderStatus
);

module.exports = router;
