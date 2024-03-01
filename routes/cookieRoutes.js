const express = require('express');
const router = express.Router();
const { setCookie, getCookie } = require('../helpers/cookieHelper');

router.get('/set', (req, res) => {
    const { name, value, httpOnly } = req.query;
    setCookie(res, name, value, httpOnly === 'true');
    res.json({ message: `Cookie ${name} set successfully.` });
});

router.get('/get/:name', (req, res) => {
    const name = req.params.name;
    const value = getCookie(req, name);
    if (value) {
        res.json({ [name]: value });
    } else {
        res.json({ message: 'Cookie not found' });
    }
});

module.exports = router;
