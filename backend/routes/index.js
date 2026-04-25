const express = require('express');
const authRoutes = require('./auth.routes');
const categoryRoutes = require('./category.routes');
const productRoutes = require('./product.routes');
const clientRoutes = require('./client.routes');
const orderRoutes = require('./order.routes');
const clientOrderRoutes = require('./clientOrder.routes');
const dashboardRoutes = require('./dashboard.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/clients', clientRoutes);
router.use('/orders', orderRoutes);
router.use('/client-orders', clientOrderRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;
