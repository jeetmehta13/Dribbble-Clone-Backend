const Joi = require('joi');

const updateDetails = Joi.object({
    body: Joi.object({
        userId: Joi.string().required().regex(/^\S+$/),
        personalbio: Joi.string().required(),
        name: Joi.string().trim().max(40).required()
    })
});

module.exports = {
    updateDetails
}