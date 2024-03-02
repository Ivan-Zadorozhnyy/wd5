const Entity = require('../models/Entity');
const logger = require('../helpers/logger');

exports.listEntities = async (req, res) => {
    try {
        const entities = await Entity.find();
        res.render('list', { entities });
    } catch (error) {
        logger.error('Error in listEntities: %o', error);
        res.status(500).send(error.message);
    }
};

exports.newEntityForm = (req, res) => {
    res.render('newEntity');
};

exports.getEntityById = async (req, res) => {
    console.log("Fetching entity with ID:", req.params.id);
    try {
        const entity = await Entity.findById(req.params.id);
        if (!entity) {
            return res.status(404).send('Entity not found');
        }
        res.render('entityDetails', { entity });
    } catch (error) {
        logger.error('Error in getEntityById: %o', error);
        res.status(500).send(error.message);
    }
};

exports.createEntity = async (req, res) => {
    try {
        const newEntity = new Entity({
            name: req.body.name,
            description: req.body.description
        });

        await newEntity.save();
        res.redirect('/');
    } catch (error) {
        logger.error('Error in createEntity: %o', error);
        res.status(500).send(error.message);
    }
};

exports.updateEntityById = async (req, res) => {
    try {
        const entity = await Entity.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                description: req.body.description
            },
            { new: true, runValidators: true }
        );
        if (!entity) {
            return res.status(404).send('Entity not found');
        }
        res.redirect('/' + entity._id);
    } catch (error) {
        logger.error('Error in updateEntityById: %o', error);
        res.status(500).send(error.message);
    }
};

exports.deleteEntityById = async (req, res) => {
    try {
        const entity = await Entity.findByIdAndDelete(req.params.id);
        if (!entity) {
            return res.status(404).send('Entity not found');
        }
        res.redirect('/');
    } catch (error) {
        logger.error('Error in deleteEntityById: %o', error);
        res.status(500).send(error.message);
    }
};

exports.editEntityForm = async (req, res) => {
    console.log('Accessing editEntityForm with ID:', req.params.id);
    try {
        const entity = await Entity.findById(req.params.id);
        if (!entity) {
            return res.status(404).send('Entity not found');
        }
        res.render('editEntity', { entity });
    } catch (error) {
        logger.error('Error in editEntityForm: %o', error);
        res.status(500).send(error.message);
    }
};
