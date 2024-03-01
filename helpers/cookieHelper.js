exports.setCookie = (res, name, value, httpOnly) => {
    const options = httpOnly ? { httpOnly: true } : undefined;
    res.cookie(name, value, options);
};

exports.getCookie = (req, name) => {
    return req.cookies[name];
};
