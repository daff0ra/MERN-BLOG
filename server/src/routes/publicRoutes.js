const express = require('express');
const articleController = require('../controllers/articleController');

const router = express.Router();
router.get('/articles/:slug', articleController.readPublic);

module.exports = router;
