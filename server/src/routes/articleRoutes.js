const express = require('express');
const authenticate = require('../middleware/authenticate');
const articleController = require('../controllers/articleController');

const router = express.Router();
router.use(authenticate);
router.get('/', articleController.list);
router.post('/', articleController.create);
router.get('/:id/preview', articleController.preview);
router.post('/:id/publish', articleController.publish);
router.post('/:id/unpublish', articleController.unpublish);
router.get('/:id', articleController.get);
router.patch('/:id', articleController.update);
router.delete('/:id', articleController.remove);

module.exports = router;
