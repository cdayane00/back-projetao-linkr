import Joi from "joi";

export const postSchema = Joi.object({
  postText: Joi.string().trim(),
  postUrl: Joi.string().uri().trim().required(),
});

export const updateSchema = Joi.object({
  postText: Joi.string().trim(),
});
