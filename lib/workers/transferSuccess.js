const rabbot = require('rabbot');
const mongoose = require('mongoose');
const { handle } = require('../services/rabbitmq');
const { sendEmail } = require('../services/mailgun');
const nunjucks = require('../services/nunjucks');
const logger = require('../logger');

rabbot.handle('transferSuccess', handle(async ({ body }) => {
  logger.info('Sending Funds Transfer Email', body);
  const { amount, recievingAccount } = body;
  const user = await mongoose.model('User').findById(body.userId);
  const account = await mongoose.model('Account').findOne({ owner: body.userId });

  const text = await nunjucks.render('transfer-success.txt', {
    name: user.name,
    accountNumber: account.number,
    accountBalance: account.balance,
    accountType: account.type,
    amount,
    recievingAccount,
  });

  const html = await nunjucks.render('transfer-success.html', {
    name: user.name,
    accountNumber: account.number,
    accountBalance: account.balance,
    accountType: account.type,
    amount,
    recievingAccount,
  });

  const data = {
    text,
    html,
    subject: 'Bánkú Alert',
    to: user.email,
    from: 'Bánkú <noreply@bánkú.app>'
  };

  await sendEmail(data);
}));
