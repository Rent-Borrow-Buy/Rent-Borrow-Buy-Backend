const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

// Built in middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: 'http://localhost:7891',
    credentials: true,
  })
);

// App routes
app.use('/api/v1/users', require('./controllers/users'));
app.use('/api/v1/items', require('./controllers/items'));
app.use('/api/v1/imageupload', require('./controllers/imageupload'));

// Error handling & 404 middleware for when
// a request doesn't match any app routes
app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
