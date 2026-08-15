const express = require('express');
const { body, param } = require('express-validator');
const categoryController = require('../controllers/category.controller');
const { protect } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');

const router = express.Router();
router.use(protect);

/**
 * @openapi
 * /categories:
 *   get:
 *     summary: List categories (paginated)
 *     tags: [Categories]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10, maximum: 100 }
 *     responses:
 *       200:
 *         description: List of categories with pagination meta
 *   post:
 *     summary: Create a category
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string }
 *               parent: { type: string, nullable: true }
 *     responses:
 *       201:
 *         description: Category created
 *       400:
 *         description: Validation failed
 */
router.get('/', categoryController.getCategories);
router.post('/',
  [body('name').trim().isLength({ min: 1, max: 100 })],
  validate,
  categoryController.createCategory
);

/**
 * @openapi
 * /categories/{id}:
 *   put:
 *     summary: Update a category
 *     tags: [Categories]
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
 *               name: { type: string }
 *     responses:
 *       200: { description: Category updated }
 *       404: { description: Category not found }
 *   delete:
 *     summary: Delete a category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Category deleted }
 *       404: { description: Category not found }
 */
router.put('/:id',
  [param('id').isMongoId(), body('name').optional().trim().isLength({ min: 1, max: 100 })],
  validate,
  categoryController.updateCategory
);
router.delete('/:id',
  [param('id').isMongoId()],
  validate,
  categoryController.deleteCategory
);

module.exports = router;
