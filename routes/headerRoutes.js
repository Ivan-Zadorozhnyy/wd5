const express = require('express');
const router = express.Router();
const asyncMiddleware = require('../middleware/asyncMiddleware');
const { setHeader, getHeader } = require('../helpers/headerHelper');

router.get('/set', asyncMiddleware((req, res) => {
    const { name, value } = req.query;
    setHeader(res, name, value);
    res.json({ message: `Header ${name} set successfully.` });
}));

router.get('/get/:name', asyncMiddleware((req, res) => {
    const name = req.params.name;
    const value = getHeader(req, name);
    if (value) {
        res.json({ [name]: value });
    } else {
        res.json({ message: 'Header not found' });
    }
}));

module.exports = router;
