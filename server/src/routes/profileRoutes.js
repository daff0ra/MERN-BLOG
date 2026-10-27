const express = require('express');
const authenticate = require('../middleware/authenticate');
const profileController = require('../controllers/profileController');

const router = express.Router();
router.use(authenticate);
router.get('/', profileController.get);
router.patch('/', profileController.update);
router.get('/portfolio-articles', profileController.getPortfolioArticles);
router.patch('/portfolio-articles', profileController.updatePortfolioArticles);

module.exports = router;
