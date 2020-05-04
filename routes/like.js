const { user, post, like } = require('../models');
const to = require('../utils/to');
const express = require('express');
const router = express.Router();

router.setLike = async (req, res) => {
    let [err, exists] = await to(post.findOne({
        where: {
            postId: req.body.postId
        }
    }));
    if (err) return res.sendError(err);
    if (!exists) return res.sendError(null, 'Post does not exist');
    let status;
    [err, status] = await to(like.findOne({
        where: {
            postId: req.body.postId,
            likedBy: req.session.key.userId
        }
    }));
    if(err) return res.sendError(err);
    if(!status)
    {
        [err] = await to(like.create({
            postId: req.body.postId,
            likedBy: req.session.key.userId,
            status: req.body.status
        }));
        if(err) return res.sendError(err);
        return res.sendSuccess();
    }
    [err] = await to(like.update(
        {
            status: req.body.status
        },
        {
            where: {
                postId: req.body.postId,
                likedBy: req.session.key.userId
            }
        }
    ));
    if (err) return res.sendError(err);
    return res.sendSuccess();
}

module.exports = router;