const express = require('express');
const controller = require('../controllers');
const policy = require('../policies');
const { catchErrors, validate } = require('../../../helpers');
const { authenticate } = require('../../../middleware');

const router = express.Router();

router.get(
  '/',
  catchErrors(authenticate),
  catchErrors(controller.myAccount),
);

router.post(
  '/send',
  catchErrors(authenticate),
  validate(policy.transfer),
  catchErrors(controller.transfer),
);

module.exports = router;
