const router = require('express').Router();
const _controller = require('../controllers/visits');
const rateLimitingCID = require('../middlewares/visitTimeLimit');
const { eventRateLimiter } = require('../middlewares/clientIpLimiting');

router.post(
  '/store-visit',
  eventRateLimiter, // limits the event by ip
  // rateLimitingCID, // limits the event by client ID
  _controller.storeVisits,
);

module.exports = router;
