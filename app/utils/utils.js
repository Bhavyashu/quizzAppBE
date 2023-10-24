const crypto = require('crypto');

/**
 *
 */
const containsAlphabets = (input) => /[a-zA-Z]/.test(input);

/**
 *
 */
const generateUniqueId = (ip, width, height, shopId) => {
  const dataString = `${ip}-${width}x${height}:${shopId}`;
  return crypto.createHash('sha256').update(dataString).digest('hex');
};

/**
 *
 */
const structureDailyData = (dailyObject, weeklyVisitsData, analyticsData) => {
  const inAppWeeklyData = analyticsData.inappBrowserVisitsWeekly;
  const addedKeys = {
    visits: weeklyVisitsData[Object.keys(weeklyVisitsData).pop()],
    inApp: inAppWeeklyData[Object.keys(inAppWeeklyData).pop()],
  };
  return { ...addedKeys, ...dailyObject };
};
module.exports = {
  containsAlphabets,
  generateUniqueId,
  structureDailyData,
};
