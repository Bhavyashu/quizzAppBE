/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
const { errors: errorCode } = require('./errors');
const { HttpError } = require('../utils/httpResponse');

/**
 *
 */
const handleError = (err) => {
  if (err?.response?.data || err?.config?.method) {
    const requestUrl = `${err?.config?.baseURL}${err?.config?.url}`;
    const requestMethod = `${err?.config?.method}`;

    err = {
      name: 'Axios Error',
      statusCode: err?.response?.status,
      test: err?.response?.statusText,
      requestUrl,
      requestMethod,
      data: err?.response?.data || err.message,
      controller: err.controller,
    };

    if (err?.statusCode === 502) {
      err.data = 'Bad Gateway';
    }

    if (typeof err.data === 'string' && err.data.includes('<html>')) {
      err.data = 'Raw html error';
    }
  }

  if (err.controller) {
    global.logger.error(
      `Get error at ${new Date().toISOString()}\nOn controller ${
        err.controller
      }\n`,
      err,
    );
  }

  return err;
};

// eslint-disable-next-line no-unused-vars
/**
 *
 */
const errorHandler = (err, req, res, next) => {
  // eslint-disable-next-line no-console
  if (err.status === false) {
    global.logger.error(
      `Get error at ${new Date().toISOString()}\nOn path ${req.path}\n`,
      err,
    );
    return res.status(err.statusCode).json(err);
  }

  if (err.name === 'ValidationError') {
    const errors = [];

    if (err.details && err.details.length > 0) {
      for (const element of err.details) {
        errors.push(element.message);
      }
      const { name, code } = errorCode[400];
      const error = new HttpError(errors[0], name, errors, code);

      global.logger.error(
        `Get error at ${new Date().toISOString()}\nOn path ${req.path}\n`,
        err,
      );

      return res.status(error.statusCode).json(error);
    }

    for (const key in err.errors) {
      errors.push(err.errors[key].message);
    }
    const { name, code } = errorCode[400];
    const error = new HttpError(
      'Required fields are not filled',
      name,
      errors,
      code,
    );

    global.logger.error(
      `Get error at ${new Date().toISOString()}\nOn path ${req.path}\n`,
      err,
    );

    return res.status(error.statusCode).json(error);
  }

  err = handleError(err);

  global.logger.error(
    `Get error at ${new Date().toISOString()}\nOn path ${req.path}\n`,
    err,
  );

  const { name, code } = errorCode[500];
  const error = new HttpError(
    'Unable to process request',
    name,
    err?.response?.data || err,
    err?.response?.status || code,
  );
  return res.status(error.statusCode).json(error);
};

module.exports = {
  handleError,
  errorHandler,
};
