const asyncHandler = require('express-async-handler');
// const mongoose = require('mongoose');

const { ShopifyUser, ShopRevenue } = require('../models');

const { generateShopifyDashboardAnalytics } = require('../services/analytics');

const { errors } = require('../error');
const { HttpError, Success } = require('../utils/httpResponse');

const getDashboardAnalytics = asyncHandler(async (req, res, next) => {
  const { id: shopId } = req.query;
  const shopifyUser = await ShopifyUser.findOne({ shop_id: shopId });
  if (!shopifyUser) {
    const { name, code } = errors[404];
    throw new HttpError('Shopify User not found', name, [], code);
  }

  // const userId = new mongoose.Types.ObjectId('6486fbb65937473e5fe21bdc'); // staging
  // const userId = new mongoose.Types.ObjectId('637b6b0802f7c995b75e010c');
  const userId = shopifyUser.user;

  const analytics = await generateShopifyDashboardAnalytics({ userId });
  const shopRevenue = await ShopRevenue.findOne({ shop_id: shopId });
  const { store_visits : storeVisits } = shopifyUser;
  analytics.total_revenue = shopRevenue?.total_revenue || 0;
  analytics.total_sales = shopRevenue?.no_sales || 0;
  analytics.shop_currency = shopRevenue?.shop_currency || 0;
  analytics.store_visits = storeVisits;
  const response = new Success('Shopify Dashboard Analytics', analytics, 200);
  res.status(response.statusCode).json(response);
});

module.exports = { getDashboardAnalytics };
