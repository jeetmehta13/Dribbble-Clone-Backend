const { user, post, userfollows, sequelize, like } = require('../models');
const to = require('../utils/to');
const Sequelize = require('sequelize');
const express = require('express');
const router = express.Router();
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');
const { Op } = require('sequelize');

router.getUserDetails = async (req, res) => {
    let userId = req.params.userid;
    [err, userData] = await to(user.findOne({
        where: {
            userId: userId
        },
        raw: true,
        attributes: ['userId', 'name', 'personalbio']
    }));
    if (err) return res.sendError(err);
    if (!userData) return res.sendError(null, 'Invalid User ID', 404);
    let followers, following;
    [err, followers] = await to(userfollows.findAll({
        raw: true,
        attributes: [Sequelize.fn('COUNT', sequelize.col('userfollows.userId'))],
        where: {
            followedId: userId,
            status: 1
        }
    }));
    if (err) return res.sendError(err);
    [err, following] = await to(userfollows.findAll({
        raw: true,
        attributes: [Sequelize.fn('COUNT', sequelize.col('userfollows.followedId'))],
        where: {
            userId: userId,
            status: 1
        }
    }));
    if (err) return res.sendError(err);
    userData['followers'] = followers[0]['COUNT(`userfollows`.`userId`)'];
    userData['following'] = following[0]['COUNT(`userfollows`.`followedId`)'];
    if (userId === req.session.key.userId)
        userData['follows'] = -1;
    else {
        let follows;
        [err, follows] = await to(userfollows.findOne({
            where: {
                userId: req.session.key.userId,
                followedId: userId,
                status: 1
            }
        }));
        if (!follows) userData['follows'] = 0;
        else userData['follows'] = 1;
    }
    let totalposts;
    [err, totalposts] = await to(post.findAll({
        raw: true,
        attributes: [Sequelize.fn('COUNT', sequelize.col('post.postId'))],
        where: {
            author: userId
        }
    }));
    userData['totalposts'] = totalposts[0]['COUNT(`post`.`postId`)'];
    return res.sendSuccess(userData);
}

router.updateDetails = async (req, res) => {
    if (req.body.userId === req.session.key.useId)
        return res.sendError(null, "Not you");
    let userData, err;
    [err, userData] = await to(user.update({
        name: req.body.name,
        personalbio: req.body.personalbio,

    }, {
        where: {
            userId: req.body.userId
        }
    }));
    if (err) return res.sendError(err);
    if (userData[0] === 0) return res.sendError(null, 'Not updated');
    [err, userData] = await to(user.findOne({
        where: {
            userId: req.body.userId
        },
        raw: true,
        attributes: ['userId', 'name', 'personalbio']
    }));
    if (err) return res.sendError(err);
    // userData.name = req.body.name;
    // userData.personalbio = req.body.personalbio;
    // await userData.save();
    return res.sendSuccess(userData);
}

module.exports = router;