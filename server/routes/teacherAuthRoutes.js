const express = require('express');
const router = express.Router();
const { login } = require('../controllers/TeacherauthController');

router.post('/login', login);

module.exports = router;