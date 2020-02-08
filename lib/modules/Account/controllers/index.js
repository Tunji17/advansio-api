const mongoose = require('mongoose');
const rabbot = require('rabbot');
const { sendJSONResponse } = require('../../../helpers');

const Account = mongoose.model('Account');

const transfer = async (req, res) => {
  const { accountNumber, amount } = req.body;

  const recievingAccount = await Account.findOne({ number: accountNumber });

  if (!recievingAccount) {
    return sendJSONResponse(res, 400, null, req.method, 'We could not validate the recieving account please verify the number');
  }

  const { _id, accountNumber: myAccountNumber } = req.decoded;

  if (accountNumber === myAccountNumber) {
    return sendJSONResponse(res, 400, null, req.method, 'You cannot perform this transaction');
  }

  const myAccount = await Account.findOne({ owner: _id, number: myAccountNumber });

  if (myAccount.balance < Math.abs(amount)) {
    return sendJSONResponse(res, 400, null, req.method, 'You do not have sufficient balance');
  }

  myAccount.balance -= Math.abs(amount);
  await myAccount.save();

  recievingAccount.balance += Math.abs(amount);
  await recievingAccount.save();

  if (process.env.NODE_ENV !== 'test') {
    await rabbot.publish('transferSuccess', {
      routingKey: 'transferSuccess',
      body: {
        userId: _id,
        amount,
        recievingAccount: accountNumber,
      }
    });
  }

  return sendJSONResponse(res, 200, null, req.method, 'Transfer Successfull');
};

const myAccount = async (req, res) => {
  const { _id, accountNumber: myAccountNumber } = req.decoded;
  const account = await Account
    .findOne({ owner: _id, number: myAccountNumber })
    .populate({
      path: 'owner',
      select: 'name email',
      model: 'User',
    });
  return sendJSONResponse(res, 200, account, req.method, 'Your account');
};

module.exports = {
  transfer,
  myAccount,
};
