import Joi = require('@hapi/joi');

export const createFeedSchema: Joi.ObjectSchema = Joi.object({
    coverPhoto: Joi.string().required(),
    title: Joi.string().min(2).max(32).required(),
    body: Joi.string().required(),
    tag: Joi.array().required(),
});

export const updateFeedSchema: Joi.ObjectSchema = Joi.object({
    title: Joi.string().min(2).max(32).required(),
    body: Joi.string().required(),
    tag: Joi.array().required(),
});
