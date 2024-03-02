const express = require('express');
const router = express.Router();
const asyncMiddleware = require('../middleware/asyncMiddleware');
const entityController = require('../controllers/entityController');

router.get('/', asyncMiddleware(entityController.listEntities));
router.get('/new', asyncMiddleware(entityController.newEntityForm));
router.post('/', asyncMiddleware(entityController.createEntity));
router.get('/:id', asyncMiddleware(entityController.getEntityById));
router.get('/edit/:id', asyncMiddleware(entityController.editEntityForm));
router.post('/update/:id', asyncMiddleware(entityController.updateEntityById));
router.post('/delete/:id', asyncMiddleware(entityController.deleteEntityById));

module.exports = router;
