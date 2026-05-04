const express = require('express');
const { param } = require('express-validator');
const fournisseurOrderController = require('../controllers/fournisseurOrder.controller');
const { protect } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');

const router = express.Router();
router.use(protect);

router.put('/:id', [param('id').isMongoId()], validate, fournisseurOrderController.updateFournisseurOrder);
router.delete('/:id', [param('id').isMongoId()], validate, fournisseurOrderController.deleteFournisseurOrder);

module.exports = router;
