require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const { connectDb } = require('./app/config/db');
const asyncHandler = require('express-async-handler');
const { errorHandler } = require('./app/error');
const routes = require('./app/routes');
const { logger } = require('./app/config/logger');
// const { Language, Exercise, Questions, Answers} = require('./app/models');
// const _execute = require('./databaseScripts');
global.logger = logger;

const app = express();

connectDb();
app.use(cors({ origin: '*' }));
app.use(express.json());

app.get('/test', (req, res) => {
  res.status(200).json({ message: 'api working' });
});

app.use((req, res, next) => {
  const allowedOrigins = ['http://localhost:3000'];
  const origin = req.headers.origin;
  console.log( `This is the origin ${allowedOrigins}`);

  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization'); // Add 'Authorization'
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Add any other HTTP methods you need

  next();
});

app.use('/api/v1', routes);
app.use(errorHandler);

require('./app/error/handleUncaughtErrors');

const PORT = process.env.PORT || 2000;
app.listen(PORT, () => logger.info(`server started at port ${PORT}`));
