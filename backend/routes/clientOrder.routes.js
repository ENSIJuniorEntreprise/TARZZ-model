const express = require('express');
const { param, body } = require('express-validator');
const controller = require('../controllers/clientOrder.controller');
const { protect } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');

const router = express.Router();

router.use(protect);

/**
 * @openapi
 * /client-orders/{id}:
 *   put:
 *     summary: Update a client order's status/remark
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
 *             properties:
 *               status: { type: string, enum: [en_commande, en_cours, livre] }
 *               remarque: { type: string }
 *     responses:
 *       200: { description: Order updated }
 *       404: { description: Order not found }
 *   delete:
 *     summary: Delete a client order
 *     tags: [Client Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Order deleted }
 *       404: { description: Order not found }
 */
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
