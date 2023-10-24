const { extractDateFromTimestamp, getDayFromDate } = require('./_datetime');

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 *
 */
const getDateObject = (startDate, endDate) => {
  const start = new Date(startDate);
  const obj = {};
  while (start <= new Date(endDate)) {
    obj[new Date(start).toISOString().slice(0, 10)] = 0;
    start.setDate(start.getDate() + 1);
  }
  return obj;
};

/**
 *
 */
const convertDateObjectToDaysObject = (obj) => {
  const days = {};
  Object.keys(obj).forEach((key) => {
    days[weekDays[getDayFromDate(key)]] = obj[key];
  });

  return days;
};

/**
 *
 */
const structureAnalytics = ({ report, startDate, endDate }) => {
  const obj = getDateObject(
    extractDateFromTimestamp(startDate),
    extractDateFromTimestamp(endDate),
  );

  report.forEach((item) => {
    obj[item._id] = item.count;
  });

  const dayResponse = convertDateObjectToDaysObject(obj);

  return dayResponse;
};

module.exports = {
  structureAnalytics,
};
