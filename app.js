const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const morgan = require('morgan');
const logger = require('./helpers/logger');
const methodOverride = require('method-override');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
    .then(() => logger.info('MongoDB connection successful'))
    .catch(err => {
        logger.error('MongoDB connection error:', err);
        process.exit(1);
    });

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

const entityRoutes = require('./routes/entityRoutes');
const cookieRoutes = require('./routes/cookieRoutes');
const headerRoutes = require('./routes/headerRoutes');

app.use('/', entityRoutes);
app.use('/cookie', cookieRoutes);
app.use('/header', headerRoutes);

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    if (process.env.NODE_ENV !== 'production') {
        logger.error(error.stack);
    } else {
        logger.error(`${error.status || 500} - ${error.message}`);
    }

    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message,
            error: process.env.NODE_ENV === 'production' ? {} : error.stack
        }
    });
});

app.use(methodOverride('_method'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
});
