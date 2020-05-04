const Joi = require('joi');

const register = Joi.object({
    body: Joi.object({
        email: Joi.string().email().required().trim(),
        password: Joi.string().required().trim(),
        userId: Joi.string().required().regex(/^\S+$/),
        name: Joi.string().trim().max(40).required()
    })
});

const login = Joi.object({
    body: Joi.object({
        email: Joi.string().email().required().trim(),
        password: Joi.string().required().trim()
    })
});

module.exports = {
    register,
    login
}