const express = require('express');
const authRoutes            = require('./auth.routes');
const categoryRoutes        = require('./category.routes');
const productRoutes         = require('./product.routes');
const clientRoutes          = require('./client.routes');
const clientOrderRoutes     = require('./clientOrder.routes');
const dashboardRoutes       = require('./dashboard.routes');
const fournisseurRoutes     = require('./fournisseur.routes');
const fournisseurOrderRoutes = require('./fournisseurOrder.routes');

const router = express.Router();

router.use('/auth',               authRoutes);
router.use('/categories',         categoryRoutes);
router.use('/products',           productRoutes);
router.use('/clients',            clientRoutes);
router.use('/client-orders',      clientOrderRoutes);
router.use('/dashboard',          dashboardRoutes);
router.use('/fournisseurs',       fournisseurRoutes);
router.use('/fournisseur-orders', fournisseurOrderRoutes);

module.exports = router;
