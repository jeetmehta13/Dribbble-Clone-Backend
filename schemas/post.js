const Joi = require('joi');

const addPost = Joi.object({
    body: Joi.object({
        title: Joi.string().required().trim(),
        subtitle: Joi.string().required().trim(),
        content: Joi.string().required(),
    })
});

const editPost = Joi.object({
    body: Joi.object({
        postId: Joi.string().guid().required(),
        title: Joi.string().required().trim(),
        subtitle: Joi.string().required().trim(),
        content: Joi.string().required(),
    })
});

const deletePost = Joi.object({
    body: Joi.object({
        postId: Joi.string().guid().required(),
    })
});

const postContent = Joi.object({
    body: Joi.object({
        postId: Joi.string().guid().required(),
    })
});

module.exports = {
    addPost,
    editPost,
    deletePost,
    postContent
}