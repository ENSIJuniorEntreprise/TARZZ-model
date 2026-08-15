const express = require('express');
const { body, param, query } = require('express-validator');
const productController = require('../controllers/product.controller');
const { protect } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { upload } = require('../middlewares/upload.middleware');

const router = express.Router();
router.use(protect);

/**
 * @openapi
 * /products:
 *   get:
 *     summary: List products (paginated, optionally filtered by category)
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *         description: ObjectId of a category
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10, maximum: 100 }
 *     responses:
 *       200: { description: List of products with pagination meta }
 *       400: { description: Invalid category id }
 *   post:
 *     summary: Create a product
 *     tags: [Products]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [name, category]
 *             properties:
 *               name: { type: string }
 *               category: { type: string }
 *               stock: { type: number }
 *               image: { type: string, format: binary }
 *     responses:
 *       201: { description: Product created }
 *       400: { description: Validation failed }
 */
router.get('/',
  [query('category').optional().isMongoId()],
  validate,
  productController.getProducts
);
router.post('/',
  upload.single('image'),
  [body('name').trim().notEmpty(), body('category').isMongoId()],
  validate,
  productController.createProduct
);

/**
 * @openapi
 * /products/{id}:
 *   put:
 *     summary: Update a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               category: { type: string }
 *               stock: { type: number }
 *               image: { type: string, format: binary }
 *     responses:
 *       200: { description: Product updated }
 *       404: { description: Product not found }
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Product deleted }
 *       404: { description: Product not found }
 */
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
