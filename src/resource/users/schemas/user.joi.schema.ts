import Joi = require('@hapi/joi');

export const createUserSchema: Joi.ObjectSchema = Joi.object({
    firstname: Joi.string().min(2).max(32).required(),
    lastname: Joi.string().min(2).max(32).required(),
    displayname: Joi.string().min(2).max(16).required(),
    email: Joi.string().email().required(),
    mobile: Joi.string().min(11).max(11).required(),
    gender: Joi.string().min(4).max(6).required(),
});

export const updateUserMobileSchema: Joi.ObjectSchema = Joi.object({
    mobile: Joi.string().min(11).max(11).required(),
});

export const updateUserDisplaynameSchema: Joi.ObjectSchema = Joi.object({
    displayname: Joi.string().min(2).max(16).required(),
});
