const { user } = require('../models');
const to = require('../utils/to');
const uuidv1 = require('uuid/v1');
const Sequelize = require('sequelize');
const bcrypt = require('bcryptjs');
const express = require('express');
const router = express.Router();

exports.register = async(req, res) => {
    let [err, newUser] = await to(user.findOne({
        where: Sequelize.or({ email: req.body.email }, { userId: req.body.userId })
    }));
    if (err) res.sendError(err);
    if(newUser) res.sendError(null, 'User Already Exists', 409);
    [err, salt] = await to(bcrypt.genSalt(10));
    if (err) res.sendError(err);
    [err, hash] = await to(bcrypt.hash(req.body.password, salt));
    if (err) res.sendError(err);
    [err, newUser] = await to(user.create({
        name: req.body.name,
        email: req.body.email,
        userId: req.body.userId,
        password: hash
    }));
    if(err) res.sendError(err);
    res.sendSuccess('User Registered');
}