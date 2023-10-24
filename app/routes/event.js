const router = require('express').Router();
const _controller = require('../controllers/events');

router.post('/addToCart', _controller.addToCart);

module.exports = router;
