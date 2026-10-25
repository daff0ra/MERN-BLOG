const express = require('express');
const authenticate = require('../middleware/authenticate');
const profileController = require('../controllers/profileController');

const router = express.Router();
router.use(authenticate);
router.get('/', profileController.get);
router.patch('/', profileController.update);

module.exports = router;
