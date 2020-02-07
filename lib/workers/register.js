const rabbot = require('rabbot');
const mongoose = require('mongoose');
const { handle } = require('../services/rabbitmq');
const { sendEmail } = require('../services/mailgun');
const nunjucks = require('../services/nunjucks');
const logger = require('../logger');

rabbot.handle('registration', handle(async ({ body }) => {
  logger.info('Sending Registration Email', body);

  const user = await mongoose.model('User').findById(body.userId);
  const account = await mongoose.model('Account').findOne({ owner: body.userId });


  const text = await nunjucks.render('register.txt', {
    name: user.name,
    accountNumber: account.number,
    accountBalance: account.balance,
    accountType: account.type,
  });

  const html = await nunjucks.render('register.html', {
    name: user.name,
    accountNumber: account.number,
    accountBalance: account.balance,
    accountType: account.type,
  });

  const data = {
    text,
    html,
    subject: 'Welcome to Bánkú',
    to: user.email,
    from: 'Bánkú <noreply@bánkú.app>'
  };

  await sendEmail(data);
}));
