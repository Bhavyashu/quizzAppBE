const router = require('express').Router();
const _controller = require('../controllers/analytics');

router.get('/get-dashboard-analytics', _controller.getDashboardAnalytics);

module.exports = router;
