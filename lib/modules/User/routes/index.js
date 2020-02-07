const express = require('express');
const controller = require('../controllers');
const policy = require('../policies');
const { catchErrors, validate } = require('../../../helpers');

const router = express.Router();

router.post(
  '/register',
  validate(policy.register),
  catchErrors(controller.register),
);

router.post(
  '/login',
  validate(policy.login),
  catchErrors(controller.login)
);


module.exports = router;
