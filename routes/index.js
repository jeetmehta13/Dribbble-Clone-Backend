const express = require('express');
const router = express.Router();

const validator = require('../utils/validator');
const schemas = require('../schemas');

const auth = require('./auth');

router.post(
    '/register',
    validator(schemas.auth.register),
    auth.register
);

module.exports = router;