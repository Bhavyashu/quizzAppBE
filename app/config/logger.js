const winston = require('winston');

const { NODE_ENV } = process.env;

const level = NODE_ENV === 'prod' ? 'error' : 'info';

const format = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json(),
);

const transports = [
  new winston.transports.File({ filename: 'error.log', level: 'error' }),
];

const logger = winston.createLogger({
  level,
  format,
  defaultMeta: { service: 'user-service' },
  transports,
});

if (NODE_ENV !== 'prod') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  );
}

module.exports = { logger };
