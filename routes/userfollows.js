const { user, userfollows } = require('../models');
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
        res.sendSuccess(null, 'Followed!');
    }
    // console.log(status['status']);
    [err] = await to(userfollows.update(
        {
            status: req.body.status
        },
        {
            where: {
                userId: req.session.key.userId,
                followedId: req.body.userId
            }
        }
    ));
    if(err) return res.sendError(err);
    return res.sendSuccess();
}

module.exports = router;