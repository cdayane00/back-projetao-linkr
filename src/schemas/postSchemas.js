import Joi from "joi";

export const postSchema = Joi.object({
  postText: Joi.string().trim().required(),
  postUrl: Joi.string().uri().trim().required(),
});
