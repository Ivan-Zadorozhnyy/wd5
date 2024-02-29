const Entity = require('../models/Entity');

exports.listEntities = async (req, res) => {
    try {
        const entities = await Entity.find();
        res.render('list', { entities });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.newEntityForm = (req, res) => {
    res.render('newEntity');
};

exports.getEntityById = async (req, res) => {
    try {
        const entity = await Entity.findById(req.params.id);
        if (!entity) {
            return res.status(404).send('Entity not found');
        }
        res.render('entityDetails', { entity });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.createEntity = async (req, res) => {
    try {
        const newEntity = new Entity(req.body);
        await newEntity.save();
        res.redirect('/');
    } catch (error) {
        res.status(500).send(error.message);
    }
};