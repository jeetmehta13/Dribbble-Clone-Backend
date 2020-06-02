const express = require('express');
const router = express.Router();

const validator = require('../utils/validator');
const schemas = require('../schemas');
const user = require('./user');
const auth = require('./auth');
const post = require('./post');
const userfollows = require('./userfollows');
const like = require('./like');

function isNotLoggedIn(req, res, next) {
    if (!req.session.key) return next();
    else res.sendError(null, 'Already Logged In');
}

function isLoggedIn(req, res, next)
{
    if (req.session.key) return next();
    else res.sendError(null, 'Not Logged in');
}

router.post(
    '/register',
    validator(schemas.auth.register),
    auth.register
);

router.post(
    '/login',
    isNotLoggedIn,
    validator(schemas.auth.login),
    auth.login
);

router.post(
    '/logout',
    auth.logout
);

router.get(
    '/status',
    auth.status
);

router.post(
    '/addPost',
    isLoggedIn,
    validator(schemas.post.addPost),
    post.addPost
);

router.post(
    '/editPost',
    isLoggedIn,
    validator(schemas.post.editPost),
    post.editPost
);

router.post(
    '/deletePost',
    isLoggedIn,
    validator(schemas.post.deletePost),
    post.deletePost
);

router.get(
    '/postsFromFollowing',
    isLoggedIn,
    post.postsFromFollowing
);

router.post(
    '/setFollowing',
    isLoggedIn,
    validator(schemas.userfollows.setFollowing),
    userfollows.setFollowing
);

router.post(
    '/setLike',
    isLoggedIn,
    validator(schemas.like.setLike),
    like.setLike
);

router.get(
    '/allPosts',
    isLoggedIn,
    post.allPosts
);

router.get(
    '/getContent',
    isLoggedIn,
    validator(schemas.post.postContent),
    post.postContent
);

router.get(
    '/userPosts/:userid',
    isLoggedIn,
    post.userPosts
);

router.get(
    '/getUserDetails/:userid',
    isLoggedIn,
    user.getUserDetails
)

module.exports = router;