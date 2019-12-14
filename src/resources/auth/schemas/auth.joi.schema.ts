import Joi = require('@hapi/joi');

export const authUserSchema: Joi.ObjectSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

export const resetPasswordSchema: Joi.ObjectSchema = Joi.object({
    email: Joi.string().email().required(),
});
