const mongoose = require('mongoose');
const rabbot = require('rabbot');
const pick = require('lodash/pick');
const { sendJSONResponse } = require('../../../helpers');
const { bonusBalance } = require('../../../config');

const User = mongoose.model('User');
const Account = mongoose.model('Account');

const register = async (req, res) => {
  const user = new User();
  const account = new Account();

  const {
    name, email, password, accountType,
  } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return sendJSONResponse(res, 400, null, req.method, 'An account with this Email already exists!');
  }

  user.name = name;
  user.email = email;

  user.setPassword(password);
  await user.save();

  const accountNumber = Math.floor(1000000000 + Math.random() * 9000000000);

  account.number = accountNumber;
  account.type = accountType;
  account.balance = bonusBalance;
  account.owner = user._id;
  await account.save();

  if (process.env.NODE_ENV !== 'test') {
    await rabbot.publish('registration', {
      routingKey: 'registration',
      body: {
        userId: user._id
      }
    });
  }

  const token = user.generateToken(accountNumber);

  const data = {
    token,
    user: pick(user, ['name', 'email']),
    account: pick(account, ['number', 'type', 'balance']),
  };

  return sendJSONResponse(res, 200, data, req.method, 'User registeration successfull, An email has been sent to you with your account details');
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email, blocked: false });

  if (!user) return sendJSONResponse(res, 400, null, req.method, 'Invalid Login Credentials');

  const validPassword = user.verifyPassword(password);

  if (!validPassword) {
    return sendJSONResponse(res, 400, null, req.method, 'Invalid Login Credentials');
  }

  const account = await Account.findOne({ owner: user._id });
  const token = user.generateToken(account.number);

  const data = {
    token,
    user: pick(user, ['name', 'email']),
    account: pick(account, ['number', 'type', 'balance']),
  };

  return sendJSONResponse(res, 200, data, req.method, 'User login successful');
};


module.exports = {
  register,
  login,
};
