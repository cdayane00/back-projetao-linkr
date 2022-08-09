import Joi from "joi";

export const signUpSchema = Joi.object({
  name: Joi.string().max(30).trim().required(),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .trim()
    .required(),
  password: Joi.string().required(),
  imageUrl: Joi.string().uri().trim().required(),
});
