const Joi = require('joi');

const resetPasswordSchema = {
  body: Joi.object({
    token: Joi.string().required().messages({
      'any.required': 'Reset token is required',
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'Password must be at least 6 characters long',
      'any.required': 'Password is required',
    }),
    passwordConfirm: Joi.string().valid(Joi.ref('password')).required().messages({
      'any.only': 'Passwords do not match',
      'any.required': 'Password confirmation is required',
    }),
  })
    .required()
    .unknown(false),
};

module.exports = resetPasswordSchema;
