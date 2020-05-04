const Joi = require('joi');

const setLike = Joi.object({
    body: Joi.object({
        postId: Joi.string().guid().required(),
        status: Joi.number().integer().required()
    })
});

module.exports = {
    setLike
}