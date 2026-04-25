const express = require('express');
const { body, param } = require('express-validator');
const clientController = require('../controllers/client.controller');
const clientOrderController = require('../controllers/clientOrder.controller');
const { protect } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');

const router = express.Router();

router.use(protect);

router.get('/', clientController.getClients);
router.get('/:id', [param('id').isMongoId().withMessage('Invalid client id')], validate, clientController.getClientById);

router.post(
  '/',
  [
    body('firstName').trim().notEmpty().withMessage('firstName is required'),
    body('lastName').trim().notEmpty().withMessage('lastName is required'),
    body('phone').optional().trim().isLength({ min: 6, max: 30 }),
    body('address').optional().trim().isLength({ max: 300 }),
  ],
  validate,
  clientController.createClient
);

router.put(
  '/:id',
  [
    param('id').isMongoId().withMessage('Invalid client id'),
    body('firstName').optional().trim().notEmpty(),
    body('lastName').optional().trim().notEmpty(),
    body('phone').optional().trim().isLength({ min: 6, max: 30 }),
    body('address').optional().trim().isLength({ max: 300 }),
  ],
  validate,
  clientController.updateClient
);

router.delete('/:id', [param('id').isMongoId().withMessage('Invalid client id')], validate, clientController.deleteClient);

// ── Commandes d'un client ─────────────────────────────────────────────────────
router.get('/:id/orders', clientOrderController.getClientOrders);
router.post(
  '/:id/orders',
  [
    param('id').isMongoId().withMessage('Invalid client id'),
    body('productName').trim().notEmpty().withMessage('productName is required'),
    body('status').optional().isIn(['en_commande', 'en_cours', 'livre']),
    body('date').optional().isISO8601(),
  ],
  validate,
  clientOrderController.createClientOrder
);

module.exports = router;
