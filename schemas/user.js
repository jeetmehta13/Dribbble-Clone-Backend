const Joi = require('joi');

const getUserDetails = Joi.object({
    body: Joi.object({
        userId: Joi.string().required().regex(/^\S+$/)
    })
});

module.exports = {
    getUserDetails
}