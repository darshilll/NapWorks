import Joi from "joi";

export const postJoi = Joi.object({
  postName: Joi.string().required(),
  description: Joi.string().required(),
  uploadTime: Joi.date().default(Date.now),
  tags: Joi.array().items(Joi.string()).optional(),
  imageUrl: Joi.string().uri().optional(),
});
