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

app.use(methodOverride('_method'));

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev', {
        stream: { write: message => logger.info(message.trim()) }
    }));
} else {
    app.use(morgan('combined', {
        stream: { write: message => logger.info(message.trim()) }
    }));
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
    const status = error.status || 500;
    const message = error.message || 'Internal Server Error';

    logger.error('Error:', { status, message, stack: error.stack });

    res.status(status).json({
        error: {
            message: message,
            stack: process.env.NODE_ENV === 'production' ? null : error.stack
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
});

process.on('uncaughtException', (error) => {
    logger.error('Unhandled Exception', error);
    process.exit(1);
});

process.on('unhandledRejection', (error) => {
    logger.error('Unhandled Rejection', error);
    process.exit(1);
});
