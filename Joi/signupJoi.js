import Joi from "joi";

export const signupJoi = Joi.object({
     name: Joi.string().required(),
     email: Joi.string().email().required(),
     password: Joi.string().min(6).required()
})

