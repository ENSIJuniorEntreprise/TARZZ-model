const express = require('express');
const { param, body } = require('express-validator');
const controller = require('../controllers/clientOrder.controller');
const { protect } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');

const router = express.Router();

router.use(protect);

router.put(
  '/:id',
  [
    param('id').isMongoId().withMessage('Invalid order id'),
    body('status').optional().isIn(['en_commande', 'en_cours', 'livre']),
  ],
  validate,
  controller.updateClientOrder
);

router.delete(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid order id')],
  validate,
  controller.deleteClientOrder
);

module.exports = router;
