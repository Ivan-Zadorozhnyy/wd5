const express = require('express');
const router = express.Router();
const { setHeader, getHeader } = require('../helpers/headerHelper');

router.get('/set', (req, res) => {
    const { name, value } = req.query;
    setHeader(res, name, value);
    res.json({ message: `Header ${name} set successfully.` });
});

router.get('/get/:name', (req, res) => {
    const name = req.params.name;
    const value = getHeader(req, name);
    if (value) {
        res.json({ [name]: value });
    } else {
        res.json({ message: 'Header not found' });
    }
});

module.exports = router;
