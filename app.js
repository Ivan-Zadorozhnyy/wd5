const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

require('./configs/db');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

const entityRoutes = require('./routes/entityRoutes');
const cookieRoutes = require('./routes/cookieRoutes');
const headerRoutes = require('./routes/headerRoutes');

app.use('/', entityRoutes);
app.use('/cookie', cookieRoutes);
app.use('/header', headerRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


