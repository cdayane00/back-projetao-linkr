import Joi from "joi";

export const postSchema = Joi.object({
  postText: Joi.string().trim().required(),
  metaUrl: Joi.string().uri().trim().required(),
});
