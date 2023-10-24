const moment = require('moment-timezone');

/**
 *
 */
const getDayFromDate = (date) => moment(date).day();

/**
 *
 */
const getPreviousDays = (daysBeforeToday, timezone = 'Asia/kolkata') => {
  const today = moment().tz(timezone);
  const previousDay = moment().tz(timezone).subtract(daysBeforeToday, 'days');

  return {
    today: new Date(today),
    previousDay: new Date(previousDay),
    startOfPreviousDay: new Date(previousDay.startOf('day')),
    endOfPreviousDay: new Date(previousDay.endOf('day')),
    startOfToday: new Date(today.startOf('day')),
    endOfToday: new Date(today.endOf('day')),
  };
};

/**
 *
 */
const extractDateFromTimestamp = (timestamp) =>
  timestamp.toISOString().split('T')[0];

module.exports = {
  getDayFromDate,
  getPreviousDays,
  extractDateFromTimestamp,
};
