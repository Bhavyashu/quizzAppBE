require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { connectDb } = require('./app/config/db');
const { errorHandler } = require('./app/error');
const routes = require('./app/routes');
const { logger } = require('./app/config/logger');
const { Language, Exercise } = require('./app/models');
global.logger = logger;

const app = express();

connectDb();
app.use(cors());
app.use(express.json());

app.get('/test', (req, res) => {
  res.status(200).json({ message: 'api working' });
});

app.use('/api/v1', routes);

app.use(errorHandler);

// require('./app/error/handleUncaughtErrors');
app.post('/addl', async (req, res) => {
  try {
    // Get the language string from req.body
    const name = req.body.language;
    console.log(name);

    // Add your asynchronous logic here, e.g., working with promises
    let lang =  new Language({
      name,
    })
    lang = await lang.save();
    console.log("lonageu created? ", lang);
    
    if (lang) {
      // Send a success response
      res.status(200).json({ success: true, message: 'Language added successfully', data : lang });
    } else {
      // Send a failure response
      res.status(400).json({ success: false, message: 'Failed to add language' });
    }
  } catch (error) {
    // Handle any errors that may occur during processing
    console.error('An error occurred:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});


const PORT = process.env.PORT || 2000;
app.listen(PORT, () => logger.info(`server started at port ${PORT}`));
