const express = require('express');
const { body, param } = require('express-validator');
const productController = require('../controllers/product.controller');
const { protect } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { upload } = require('../middlewares/upload.middleware');

const router = express.Router();

router.use(protect);

router.get('/', productController.getProducts);

router.post(
  '/',
  upload.single('image'),
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('reference').trim().notEmpty().withMessage('Reference is required'),
    body('purchasePrice').isFloat({ min: 0 }).withMessage('purchasePrice must be >= 0'),
    body('sellingPrice').isFloat({ min: 0 }).withMessage('sellingPrice must be >= 0'),
    body('stockQuantity').isInt({ min: 0 }).withMessage('stockQuantity must be >= 0'),
    body().custom(value => {
      if (!value.category && !value.categoryName) {
        throw new Error('Either category or categoryName is required');
      }
      return true;
    }),
  ],
  validate,
  productController.createProduct
);

router.put(
  '/:id',
  upload.single('image'),
  [
    param('id').isMongoId().withMessage('Invalid product id'),
    body('purchasePrice').optional().isFloat({ min: 0 }),
    body('sellingPrice').optional().isFloat({ min: 0 }),
    body('stockQuantity').optional().isInt({ min: 0 }),
  ],
  validate,
  productController.updateProduct
);

router.delete('/:id', [param('id').isMongoId().withMessage('Invalid product id')], validate, productController.deleteProduct);

module.exports = router;
