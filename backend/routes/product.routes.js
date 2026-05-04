const express = require('express');
const { body, param } = require('express-validator');
const productController = require('../controllers/product.controller');
const { protect } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { upload } = require('../middlewares/upload.middleware');

const router = express.Router();
router.use(protect);

router.get('/', productController.getProducts);
router.post('/',
  upload.single('image'),
  [body('name').trim().notEmpty(), body('category').isMongoId()],
  validate,
  productController.createProduct
);
router.put('/:id',
  upload.single('image'),
  [param('id').isMongoId()],
  validate,
  productController.updateProduct
);
router.delete('/:id',
  [param('id').isMongoId()],
  validate,
  productController.deleteProduct
);

module.exports = router;
