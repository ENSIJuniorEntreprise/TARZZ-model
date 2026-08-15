const express = require('express');
const { param } = require('express-validator');
const fournisseurOrderController = require('../controllers/fournisseurOrder.controller');
const { protect } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');

const router = express.Router();
router.use(protect);

/**
 * @openapi
 * /fournisseur-orders/{id}:
 *   put:
 *     summary: Update a fournisseur order's status/remark
 *     tags: [Fournisseur Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Order updated }
 *       404: { description: Order not found }
 *   delete:
 *     summary: Delete a fournisseur order
 *     tags: [Fournisseur Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Order deleted }
 *       404: { description: Order not found }
 */
router.put('/:id', [param('id').isMongoId()], validate, fournisseurOrderController.updateFournisseurOrder);
router.delete('/:id', [param('id').isMongoId()], validate, fournisseurOrderController.deleteFournisseurOrder);

module.exports = router;
