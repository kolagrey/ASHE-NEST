import Joi = require('@hapi/joi');

export const updateUserMobileSchema: Joi.ObjectSchema = Joi.object({
    mobile: Joi.string().min(11).max(11).required(),
});

export const updateUserDisplaynameSchema: Joi.ObjectSchema = Joi.object({
    displayname: Joi.string().min(2).max(16).required(),
});
