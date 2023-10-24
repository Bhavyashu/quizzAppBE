const router = require('express').Router();
const _controller = require('../controllers/purchases');

router.post('/storePurchase', _controller.storePurchase);

module.exports = router;
