import Joi from "joi";

export const postJoi = Joi.object({
  userId: Joi.string().required(),
  postName: Joi.string().required(),
  description: Joi.string().required(),
  uploadTime: Joi.date().default(Date.now),
  tags: Joi.array().items(Joi.string()).optional(),
  imageUrl: Joi.string().uri().optional(),
});
