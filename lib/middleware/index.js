const { verify } = require('jsonwebtoken');
const { promisify } = require('util');
const { sendJSONResponse } = require('../helpers');
const config = require('../config');

const verifyToken = promisify(verify);

const authenticate = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return sendJSONResponse(
      res,
      401,
      null,
      req.method,
      'Authentication Failed, Please provide an authentication token',
    );
  }
  try {
    const decoded = await verifyToken(token, config.secrect);
    req.decoded = decoded;
    return next();
  } catch (error) {
    return sendJSONResponse(res, 401, error.message, req.method, 'Authentication Failed');
  }
};

module.exports = {
  authenticate,
};
