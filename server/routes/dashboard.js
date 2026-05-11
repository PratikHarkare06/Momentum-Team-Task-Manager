const express = require('express');
const router = express.Router();
const { getStats, getOverdueTasks, getChartData } = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/stats', getStats);
router.get('/overdue', getOverdueTasks);
router.get('/chart-data', getChartData);

module.exports = router;
