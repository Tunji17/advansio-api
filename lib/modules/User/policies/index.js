const joi = require('@hapi/joi');

const register = {
  body: {
    name: joi.string().required().min(2).max(20),
    email: joi.string().email().required(),
    password: joi.string().min(6).max(200).required(),
    accountType: joi.string().min(4).max(200).required(),
  }
};

const login = {
  body: {
    email: joi.string().email().required(),
    password: joi.string().required(),
  }
};

module.exports = {
  register,
  login,
};
