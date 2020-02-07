const joi = require('@hapi/joi');

const transfer = {
  body: {
    accountNumber: joi.number().integer().min(1000000000).max(9999999999),
    amount: joi.number().integer().min(100).max(9999999),
  },
};

module.exports = {
  transfer,
};
