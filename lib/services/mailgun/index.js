const mailgun = require('mailgun-js');
const config = require('../../config');
const logger = require('../../logger');

const { mailgun: mailgunConfig } = config;

const { apiKey, domain } = mailgunConfig;

const connection = mailgun({
  apiKey,
  domain,
});

const sendEmail = async (data) => {
  try {
    logger.info('sending email');

    await connection.messages().send(data);
  } catch (error) {
    logger.error(`An error occurred when sending mail: ${error}`);
  }
};

module.exports = {
  sendEmail,
};
