const asyncHandler = require('express-async-handler');

const { ShopifyUser, VisitEvents, ShopRevenue } = require('../models');

const checkOiaUtm = require('../services/oiaUtm');

const { errors } = require('../error');
const { HttpError, Success } = require('../utils/httpResponse');

// eslint-disable-next-line no-unused-vars
const storeVisits = asyncHandler(async (req, res, next) => {
  const shopId = req.body.storedetail?.shop_id;
  const href = req.body.event.context.document.location.href;
  const responseObj = {};
  const userAgent = req.body.userAgent;
  const isInAppBrowser = req.body.isInApp;
  const isOiaUtm = checkOiaUtm(href);
  const ip = req.clientIp;

  const shopUser = await ShopifyUser.findOne({ shop_id: shopId });

  if (!shopUser) {
    const { name, code } = errors[404];
    throw new HttpError('Cannot find the shopify user', name, code);
  }
  const shopData = await ShopRevenue.findOne({ shop_id: shopId });
  if (!shopData) {
    const numSales = 0;
    const visitsCount = 1;
    const totalRevenue = 0;
    const cartEvents = 0;

    const createShopData = new ShopRevenue({
      shop_id: shopId,
      shop_name: shopUser.shop_name,
      no_sales: numSales,
      total_revenue: totalRevenue,
      total_store_visits: visitsCount,
      total_cart_events: cartEvents,
    });
    await createShopData.save();
  } else {
    shopData.total_store_visits += 1;
    shopData.save();
  }

  const shopName = shopUser.shop_name;
  const eventName = req.body.event.name;
  const clientId = req.body.event.clientId;
  console.log(
    `\n==================This is the event name : ${eventName} ============\n `,
    `\n==================This is the clientId :${clientId} ============\n`,
  );
  const visitEvent = new VisitEvents({
    shop_id: shopId,
    shop_name: shopName,
    event_name: eventName,
    client_id: clientId,
    event_data: req.body,
    user_agent: userAgent,
    is_in_app: isInAppBrowser,
    contains_oia_utm: isOiaUtm,
    ip,
  });
  visitEvent.save();
  const response = new Success('Shopify Vists Stored', responseObj, 201);
  res.status(response.statusCode).json(response);
});

module.exports = { storeVisits };
