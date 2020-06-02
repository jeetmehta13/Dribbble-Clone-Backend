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
    if (err) return res.sendError(err);
    if(newUser) return res.sendError(null, 'User Already Exists', 409);
    [err, salt] = await to(bcrypt.genSalt(10));
    if (err) return res.sendError(err);
    [err, hash] = await to(bcrypt.hash(req.body.password, salt));
    if (err) return res.sendError(err);
    [err, newUser] = await to(user.create({
        name: req.body.name,
        email: req.body.email,
        userId: req.body.userId,
        password: hash
    }));
    if(err) return res.sendError(err);
    res.sendSuccess('User Registered');
}

exports.login = async(req, res) => {
    let [err, userInfo] = await to(user.findOne({
        where: {
            email: req.body.email
        },
        attributes: ['userId', 'name', 'password']
    }));
    if(err) return res.sendError(err);
    if(!userInfo) return res.sendError(null, 'Incorrect Email');
    [err, authorized] = await to(bcrypt.compare(req.body.password, userInfo.password));
    if(err) return res.sendError(err);
    if(!authorized) return res.sendError(null, 'Incorrect Password');
    userInfo.password = undefined;
    delete userInfo.password;
    req.session.key = userInfo;
    req.session.save(() => res.sendSuccess(userInfo))
}

exports.logout = async(req, res) => {
    if(req.session.key)
        req.session.destroy(() => res.sendSuccess(null, 'Logged Out'));
    else res.sendSuccess(null, 'Logged Out');
}

exports.status = async(req, res) => {
    if(req.session.key)
        res.sendSuccess({
            Loggedin: true,
            SessionDetails: {
                name: req.session.key.name,
                userId: req.session.key.userId,
                email: req.session.key.email,
                bio: req.session.key.personalbio,
            }
        });
    else res.sendSuccess({ Loggedin: false });
}