const express = require('express');
const { body, param } = require('express-validator');
const fournisseurController = require('../controllers/fournisseur.controller');
const fournisseurOrderController = require('../controllers/fournisseurOrder.controller');
const { protect } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');

const router = express.Router();
router.use(protect);

/**
 * @openapi
 * /fournisseurs:
 *   get:
 *     summary: List fournisseurs (paginated, searchable)
 *     tags: [Fournisseurs]
 *     responses:
 *       200: { description: List of fournisseurs }
 *   post:
 *     summary: Create a fournisseur
 *     tags: [Fournisseurs]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/Fournisseur' }
 *     responses:
 *       201: { description: Fournisseur created }
 * /fournisseurs/{id}:
 *   get:
 *     summary: Get a fournisseur by id
 *     tags: [Fournisseurs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Fournisseur found }
 *       404: { description: Fournisseur not found }
 *   put:
 *     summary: Update a fournisseur
 *     tags: [Fournisseurs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Fournisseur updated }
 *   delete:
 *     summary: Delete a fournisseur
 *     tags: [Fournisseurs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Fournisseur deleted }
 */
router.get('/', fournisseurController.getFournisseurs);
router.get('/:id', [param('id').isMongoId()], validate, fournisseurController.getFournisseur);
router.post('/',
  [body('prenom').trim().notEmpty(), body('nom').trim().notEmpty()],
  validate,
  fournisseurController.createFournisseur
);
router.put('/:id', [param('id').isMongoId()], validate, fournisseurController.updateFournisseur);
router.delete('/:id', [param('id').isMongoId()], validate, fournisseurController.deleteFournisseur);

/**
 * @openapi
 * /fournisseurs/{id}/orders:
 *   get:
 *     summary: List orders for a fournisseur
 *     tags: [Fournisseur Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Orders for the fournisseur }
 *   post:
 *     summary: Create an order for a fournisseur
 *     tags: [Fournisseur Orders]
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
 *               status: { type: string, enum: [en_attente, confirme, recu] }
 *               remarque: { type: string }
 *     responses:
 *       201: { description: Order created }
 */
// Orders nested under fournisseur
router.get('/:id/orders', [param('id').isMongoId()], validate, fournisseurOrderController.getFournisseurOrders);
router.post('/:id/orders',
  [
    param('id').isMongoId(),
    body('items').isArray({ min: 1 }),
    body('items.*.productName').trim().notEmpty(),
  ],
  validate,
  fournisseurOrderController.createFournisseurOrder
);

module.exports = router;
