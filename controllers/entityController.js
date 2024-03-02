const Entity = require('../models/Entity');
const NodeCache = require('node-cache');
const logger = require('../helpers/logger');

const myCache = new NodeCache({ stdTTL: 60 });

exports.listEntities = async (req, res) => {
    try {
        let entities = myCache.get('entities');
        if (!entities) {
            entities = await Entity.find();
            myCache.set('entities', entities);
        }
        res.render('list', { entities });
    } catch (error) {
        logger.error('Error in listEntities: %o', error);
        res.status(500).render('error', { error: 'Internal Server Error' });
    }
};

exports.newEntityForm = (req, res) => {
    res.render('newEntity');
};

exports.getEntityById = async (req, res) => {
    try {
        const entity = await Entity.findById(req.params.id);
        if (!entity) {
            return res.status(404).render('error', { error: 'Entity not found' });
        }
        res.render('entityDetails', { entity });
    } catch (error) {
        logger.error('Error in getEntityById: %o', error);
        res.status(500).render('error', { error: 'Internal Server Error' });
    }
};

exports.createEntity = async (req, res) => {
    try {
        const newEntity = new Entity({
            name: req.body.name,
            description: req.body.description
        });

        await newEntity.save();
        myCache.del('entities');
        res.redirect('/');
    } catch (error) {
        logger.error('Error in createEntity: %o', error);
        res.status(500).render('error', { error: 'Internal Server Error' });
    }
};

exports.updateEntityById = async (req, res) => {
    try {
        const entity = await Entity.findByIdAndUpdate(
            req.params.id,
            { name: req.body.name, description: req.body.description },
            { new: true, runValidators: true }
        );

        if (!entity) {
            return res.status(404).render('error', { error: 'Entity not found' });
        }

        myCache.del('entities');
        res.redirect('/' + entity._id);
    } catch (error) {
        logger.error('Error in updateEntityById: %o', error);
        res.status(500).render('error', { error: 'Internal Server Error' });
    }
};

exports.deleteEntityById = async (req, res) => {
    try {
        const entity = await Entity.findByIdAndDelete(req.params.id);
        if (!entity) {
            return res.status(404).render('error', { error: 'Entity not found' });
        }

        myCache.del('entities');
        res.redirect('/');
    } catch (error) {
        logger.error('Error in deleteEntityById: %o', error);
        res.status(500).render('error', { error: 'Internal Server Error' });
    }
};

exports.editEntityForm = async (req, res) => {
    try {
        const entity = await Entity.findById(req.params.id);
        if (!entity) {
            return res.status(404).render('error', { error: 'Entity not found' });
        }
        res.render('editEntity', { entity });
    } catch (error) {
        logger.error('Error in editEntityForm: %o', error);
        res.status(500).render('error', { error: 'Internal Server Error' });
    }
};
