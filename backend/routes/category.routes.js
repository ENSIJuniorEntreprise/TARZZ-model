const express = require('express');
const { body, param } = require('express-validator');
const categoryController = require('../controllers/category.controller');
const { protect } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');

const router = express.Router();

router.use(protect);

router.get('/', categoryController.getCategories);

router.post('/', [body('name').trim().isLength({ min: 2, max: 80 })], validate, categoryController.createCategory);

router.put(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid category id'), body('name').trim().isLength({ min: 2, max: 80 })],
  validate,
  categoryController.updateCategory
);

router.delete('/:id', [param('id').isMongoId().withMessage('Invalid category id')], validate, categoryController.deleteCategory);

module.exports = router;
