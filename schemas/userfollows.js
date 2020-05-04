const Joi = require('joi');

const setFollowing = Joi.object({
    body: Joi.object({
        userId: Joi.string().required().regex(/^\S+$/),
        status: Joi.number().integer().required()
    })
});

module.exports = {
    setFollowing
}