const express = require('express');
const articleController = require('../controllers/articleController');
const profileController = require('../controllers/profileController');

const router = express.Router();
router.get('/portfolios/:id', profileController.readPublicPortfolio);
router.get('/articles/:slug', articleController.readPublic);

module.exports = router;
