const express = require('express');
const router = express.Router();
const entityController = require('../controllers/entityController');

router.get('/', entityController.listEntities);
router.get('/new', entityController.newEntityForm);
router.get('/:id', entityController.getEntityById);
router.post('/', entityController.createEntity);

module.exports = router;
