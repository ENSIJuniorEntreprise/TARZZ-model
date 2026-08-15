const express = require('express');
const { protect } = require('../middlewares/auth.middleware');
const dashboardController = require('../controllers/dashboard.controller');

const router = express.Router();

router.use(protect);

/**
 * @openapi
 * /dashboard:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Dashboard]
 *     responses:
 *       200: { description: Aggregated stats (clients, orders by status, monthly history) }
 * /dashboard/search:
 *   get:
 *     summary: Global search across products and clients
 *     tags: [Dashboard]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *     responses:
 *       200: { description: Matching products and clients }
 */
router.get('/', dashboardController.getDashboard);
router.get('/search', dashboardController.getGlobalSearch);

module.exports = router;
