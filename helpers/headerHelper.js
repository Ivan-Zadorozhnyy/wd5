exports.setHeader = (res, name, value) => {
    res.set(name, value);
};

exports.getHeader = (req, name) => {
    return req.get(name);
};
