const express = require('express');
const { signin } = require('../controllers/auth');

const router = express.Router();

router.post('/signin', signin);

module.exports = router;