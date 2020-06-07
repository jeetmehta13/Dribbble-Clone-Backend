const { user, userfollows, sequelize } = require('../models');
const Sequelize = require('sequelize');
const to = require('../utils/to');
const express = require('express');
const router = express.Router();

router.setFollowing = async(req, res) => {
    if (req.session.key.userId === req.body.userId)
        return res.sendError(null, 'Cannot Follow Yourself!');
    let [err, exists] = await to(user.findOne({
        where: {
            userId: req.body.userId
        }
    }));
    if(err) return res.sendError(err);
    if(!exists) return res.sendError(null, 'Invalid id');
    let status;
    [err, status] = await to(userfollows.findOne({
        where: {
            userId: req.session.key.userId,
            followedId: req.body.userId
        }
    }));
    if(err) return res.sendError(err);
    if(!status)
    {
        [err] = await to(userfollows.create({
            userId: req.session.key.userId,
            followedId: req.body.userId,
            status: req.body.status
        }));
        if(err) return res.sendError(err);
        return res.sendSuccess(null, 'Followed!');
    }
    // console.log(status['status']);
    [err] = await to(userfollows.update(
        {
            status: req.body.status
        },
        {
            where: {
                userId: req.session.key.userId,
                followedId: req.body.userId,
            }
        }
    ));
    if(err) return res.sendError(err);
    return res.sendSuccess(null, 'Followed!');
}

router.getFollowers = async(req, res) => {
    let userId = req.params.userId;
    let [err, exists] = await to(user.findOne({
        where: {
            userId: userId
        }
    }));
    if (err) return res.sendError(err);
    if (!exists) return res.sendError(null, 'Invalid id');
    let followers;
    [err, followers] = await to(sequelize.query(
        'Select users.userId, users.name from users, userfollows where users.userId = userfollows.userId and status = 1 and userfollows.followedId="'+userId+'";',
        { type: Sequelize.QueryTypes.SELECT }
    ));
    for (let i = 0; i < followers.length; i++) {
        const element = followers[i];
        if (element['userId'] === req.session.key.userId)
        {
            followers[i]['follows'] = -1;
            continue;
        }
        let exists;
        [err, exists] = await to(userfollows.findOne({
            where : {
                userId: req.session.key.userId,
                followedId: element['userId'],
                status: 1
            }
        }));
        if(!exists) followers[i]['follows'] = 0;
        else followers[i]['follows'] = 1;
    }
    if (err) return res.sendError(err);
    res.sendSuccess(followers);
}

router.getFollowing = async(req, res) => {
    let userId = req.params.userId;
    let [err, exists] = await to(user.findOne({
        where: {
            userId: userId
        }
    }));
    if (err) return res.sendError(err);
    if (!exists) return res.sendError(null, 'Invalid id');
    let followers;
    [err, followers] = await to(sequelize.query(
        'Select users.userId, users.name from users, userfollows where users.userId = userfollows.followedId and status = 1 and userfollows.userId="' + userId + '";',
        { type: Sequelize.QueryTypes.SELECT }
    ));
    for (let i = 0; i < followers.length; i++) {
        const element = followers[i];
        if (element['userId'] === req.session.key.userId) {
            followers[i]['follows'] = -1;
            continue;
        }
        let exists;
        [err, exists] = await to(userfollows.findOne({
            where: {
                userId: req.session.key.userId,
                followedId: element['userId'],
                status: 1
            }
        }));
        if (!exists) followers[i]['follows'] = 0;
        else followers[i]['follows'] = 1;
    }
    if (err) return res.sendError(err);
    res.sendSuccess(followers);
}

module.exports = router;