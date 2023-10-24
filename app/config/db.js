/* eslint-disable no-console */
const mongoose = require('mongoose');

const { MONGODB_URI } = process.env;

const connectDb = async () => {
  try {
    mongoose.set("strictQuery", false);
    const conn = await mongoose.connect(MONGODB_URI);
    console.log('database connected');
    global.logger.info(
      `Database connected: ${conn.connection.host} ${conn.connection.port}`,
    );
  } catch (e) {
    console.log(`Database connection error: ${e}`);
    global.logger.error(`Database connection error: ${e}`);
    process.exit(1);
  }
};

module.exports = { connectDb };
