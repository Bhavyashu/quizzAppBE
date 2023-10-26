const calculatePercentage = (count, total) => {
  return ((count / total) * 100).toFixed(2) + '%';
};

module.exports = {calculatePercentage}