const express = require('express');
const { body, param } = require('express-validator');
const clientController = require('../controllers/client.controller');
const clientOrderController = require('../controllers/clientOrder.controller');
const { protect } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');

const router = express.Router();

router.use(protect);

/**
 * @openapi
 * /clients:
 *   get:
 *     summary: List clients (paginated, searchable)
 *     tags: [Clients]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10, maximum: 100 }
 *     responses:
 *       200: { description: List of clients with pagination meta }
 * /clients/{id}:
 *   get:
 *     summary: Get a client by id
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Client found }
 *       404: { description: Client not found }
 */
router.get('/', clientController.getClients);
router.get('/:id', [param('id').isMongoId().withMessage('Invalid client id')], validate, clientController.getClientById);

/**
 * @openapi
 * /clients:
 *   post:
 *     summary: Create a client
 *     tags: [Clients]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [firstName, lastName]
 *             properties:
 *               firstName: { type: string }
 *               lastName: { type: string }
 *               phone: { type: string }
 *               address: { type: string }
 *     responses:
 *       201: { description: Client created }
 *       400: { description: Validation failed }
 */
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

/**
 * @openapi
 * /clients/{id}:
 *   put:
 *     summary: Update a client
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Client updated }
 *       404: { description: Client not found }
 *   delete:
 *     summary: Delete a client
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Client deleted }
 *       404: { description: Client not found }
 */
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

/**
 * @openapi
 * /clients/{id}/orders:
 *   get:
 *     summary: List orders for a client
 *     tags: [Client Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Orders for the client }
 *   post:
 *     summary: Create an order for a client
 *     tags: [Client Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [items]
 *             properties:
 *               items:
 *                 type: array
 *                 items: { $ref: '#/components/schemas/ClientOrderItem' }
 *               status: { type: string, enum: [en_commande, en_cours, livre] }
 *               date: { type: string, format: date-time }
 *               remarque: { type: string }
 *     responses:
 *       201: { description: Order created }
 *       400: { description: Validation failed }
 *       404: { description: Client not found }
 */
// ── Commandes d'un client ─────────────────────────────────────────────────────
router.get('/:id/orders', clientOrderController.getClientOrders);
router.post(
  '/:id/orders',
  [
    param('id').isMongoId().withMessage('Invalid client id'),
    body('items').isArray({ min: 1 }).withMessage('items must be a non-empty array'),
    body('items.*.productName').notEmpty().withMessage('productName is required for each item'),
    body('status').optional().isIn(['en_commande', 'en_cours', 'livre']),
    body('date').optional().isISO8601(),
  ],
  validate,
  clientOrderController.createClientOrder
);

module.exports = router;
