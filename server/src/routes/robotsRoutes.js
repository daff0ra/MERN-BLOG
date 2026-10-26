const express = require('express');

const router = express.Router();

router.get('/robots.txt', (req, res) => {
  res.type('text/plain').status(200).send([
    'User-agent: *',
    'Disallow: /api/',
    '',
  ].join('\n'));
});

module.exports = router;
