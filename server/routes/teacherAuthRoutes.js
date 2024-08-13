const express = require('express');
const router = express.Router();
const { login } = require('../controllers/TeacherAuthController');

router.post('/login', login);

module.exports = router;