const express = require('express');
const { body, param } = require('express-validator');
const fournisseurController = require('../controllers/fournisseur.controller');
const fournisseurOrderController = require('../controllers/fournisseurOrder.controller');
const { protect } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');

const router = express.Router();
router.use(protect);

router.get('/', fournisseurController.getFournisseurs);
router.get('/:id', [param('id').isMongoId()], validate, fournisseurController.getFournisseur);
router.post('/',
  [body('prenom').trim().notEmpty(), body('nom').trim().notEmpty()],
  validate,
  fournisseurController.createFournisseur
);
router.put('/:id', [param('id').isMongoId()], validate, fournisseurController.updateFournisseur);
router.delete('/:id', [param('id').isMongoId()], validate, fournisseurController.deleteFournisseur);

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
