const { user, post, userfollows, sequelize, like } = require('../models');
const to = require('../utils/to');
const { v1: uuidv1 } = require('uuid');
const Sequelize = require('sequelize');
const express = require('express');
const router = express.Router();
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');
const { Op } = require('sequelize');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

aws.config.update({
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    region: process.env.AWS_REGION
});

const limits = { fileSize: 1024 * 1024 * 512 };

const allowedMimetypes = new Set([
    'image/jpeg',
    'image/png',
    'image/jpg',
]);

const fileFilter = (req, file, cb) => {
    if (allowedMimetypes.has(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only jpg, jpeg and png accepted!'), false);
    }
};

const s3 = new aws.S3();

const uploadObject = multer({
    fileFilter,
    storage: multerS3({
        acl: 'public-read',
        s3,
        bucket: process.env.AWS_BUCKET,
        contentType: function (req, file, cb) {
            cb(null, file.mimetype);
        },
        contentDisposition: 'inline',
        key: function (req, file, cb) {
            console.log('Uploading..');
            console.log(file);
            cb(null, new Date().toISOString() + "-" + file.originalname, err => {
                if (err) console.log(err);
            });
        }
    }),
    limits: limits
}).single("file");

router.addPost = async(req, res) => {
    // if(req.file === undefined)
    //     return res.sendError(null, 'A valid file is required');
    const postId = await uuidv1();
    const userId = req.session.key.userId;
    if (!userId) return res.sendError(null, 'Not Logged In');
    try{
        uploadObject(req, res, async err => {
            if(err) res.sendError(err);
            let [error, newPost] = await to(post.create({
                postId: postId,
                author: userId,
                title: req.body.title,
                subtitle: req.body.subtitle,
                content: req.body.content,
                postLink: req.file.location,
                originalName: req.file.originalname
            }));
            if (error) return res.sendError(error);
            return res.sendSuccess(newPost);
        })
    } catch(err) {
        return res.sendError(err);
    }
    
}

router.editPost = async(req, res) => {
    let [err, thePost] = await to(post.findOne({
        where: {
            postId: req.body.postId
        }
    }));
    if (err) return res.sendError(err);
    if(!thePost) res.sendError(null, 'Post does not exist!');
    if (thePost.author !== req.session.key.userId)
        return res.sendError(null, 'You do not own this post');
    [err, newPost] = await to(post.update(
        {
            title: req.body.title,
            subtitle: req.body.subtitle,
            content: req.body.content
        },
        {
            where: {
                postId: req.body.postId
            }
        }
    ));
    if (err) return res.sendError(err);
    res.sendSuccess(newPost);
}

router.deletePost = async(req, res) => {
    let [err, thePost] = await to(post.findOne({
        where: {
            postId: req.body.postId
        }
    }));
    if (err) return res.sendError(err);
    if (!thePost) res.sendError(null, 'Post does not exist!');
    if(thePost.author !== req.session.key.userId)
        return res.sendError(null, 'You do not own this post');
    [err] = await to(post.destroy({
        where: {
            postId: req.body.postId
        }
    }));
    if (err) return res.sendError(err);
    res.sendSuccess(null, 'Successfully deleted')
}

router.postsFromFollowing = async(req, res) => {
    if(req.session.key === undefined)
        return res.sendError(null, 'Not Logged In');
    let [err, following] = await to(userfollows.findAll({
        raw: true,
        where: {
            userId: req.session.key.userId,
            status: 1
        },
        attributes: ['followedId'],
    }));
    if(err) return res.sendError(err);
    if(following.length < 1) return res.sendSuccess(following);
    let data = [];
    for (let i = 0; i < following.length; i++) {
        const element = following[i];
        data.push(element.followedId);
    }
    let getPosts;
    [err, getPosts] = await to(post.findAll({
        raw: true,
        where: {
            author: {
                [Op.in] : data
            }
        },
        order: [
            ['createdAt', 'DESC'],
            // ['name', 'ASC'],
        ],
        attributes: ['title', 'subtitle', 'author', 'postLink', 'createdAt', 'postId']
    }));
    if(err) return res.sendError(err);
    if(getPosts.length < 1) return res.sendSuccess(null, 'Follow more people');
    let finalPosts = [];
    for (let i = 0; i < getPosts.length; i++) {
        const element = getPosts[i];
        try {
            let totallikes;
            [err, totallikes] = await to(like.findAll({
                raw: true,
                attributes: [sequelize.fn('COUNT', sequelize.col('like.likedBy'))],
                where: {
                    postId: element['postId'],
                    status: 1
                }
            }));
            if(err) throw err;
            element['likes'] = totallikes[0]['COUNT(`like`.`likedBy`)'];
            // console.log(element['likes']);
        } catch (err) {
            return res.sendError(err);
        }
    }
    return res.sendSuccess(getPosts);
}

router.allPosts = async(req, res) => {
    [err, getPosts] = await to(post.findAll({
        attributes: ['title', 'subtitle', 'author', 'postLink', 'createdAt', 'postId'],
        raw: true,
        order: [
            ['createdAt', 'DESC'],
            // ['name', 'ASC'],
        ],
    }));
    if(err) return res.sendError(err);
    for (let i = 0; i < getPosts.length; i++) {
        const element = getPosts[i];
        try {
            let totallikes;
            [err, totallikes] = await to(like.findAll({
                raw: true,
                attributes: [sequelize.fn('COUNT', sequelize.col('like.likedBy'))],
                where: {
                    postId: element['postId'],
                    status: 1
                }
            }));
            if (err) throw err;
            element['likes'] = totallikes[0]['COUNT(`like`.`likedBy`)'];
            // console.log(element['likes']);
        } catch (err) {
            return res.sendError(err);
        }
    }
    return res.sendSuccess(getPosts);
}

router.postContent = async(req, res) => {
    [err, content] = await to(post.findOne({
        attributes: ['content'],
        where: {
            postId: req.params.postId
        }
    }));
    if(err) return res.sendError(err);
    return res.sendSuccess(content);
}

router.userPosts = async(req, res) => {
    let getPosts;
    [err, getPosts] = await to(post.findAll({
        raw: true,
        where: {
            author: req.params.userid
        },
        attributes: ['title', 'subtitle', 'author', 'postLink', 'createdAt', 'postId'],
        order: [
            ['createdAt', 'DESC'],
            // ['name', 'ASC'],
        ],
    }));
    if (err) return res.sendError(err);
    if (getPosts.length < 1) return res.sendSuccess(getPosts);
    let finalPosts = [];
    for (let i = 0; i < getPosts.length; i++) {
        const element = getPosts[i];
        try {
            let totallikes;
            [err, totallikes] = await to(like.findAll({
                raw: true,
                attributes: [sequelize.fn('COUNT', sequelize.col('like.likedBy'))],
                where: {
                    postId: element['postId'],
                    status: 1
                }
            }));
            if (err) throw err;
            element['likes'] = totallikes[0]['COUNT(`like`.`likedBy`)'];
            // console.log(element['likes']);
        } catch (err) {
            return res.sendError(err);
        }
    }
    return res.sendSuccess(getPosts);
}

module.exports = router;