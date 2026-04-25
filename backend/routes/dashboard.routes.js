const express = require('express');
const { protect } = require('../middlewares/auth.middleware');
const dashboardController = require('../controllers/dashboard.controller');

const router = express.Router();

router.use(protect);

router.get('/', dashboardController.getDashboard);
router.get('/search', dashboardController.getGlobalSearch);

module.exports = router;
