
module.exports = {
  mongo: {
    url: process.env.MONGODB_URL,
  },
  logger: {
    level: process.env.LOGGERLEVEL || 'debug',
  },
  mailgun: {
    apiKey: process.env.MAILGUNAPIKEY,
    domain: process.env.MAILGUNDOMAIN,
  },
  baseUrl: process.env.BASEURL,
  frontEndUrl: process.env.FRONTEND_URL,
  enableHttps: false,
  enableWorkers: false,
  port: process.env.PORT,
  secrect: process.env.SECRET,
  bonusBalance: process.env.SIGNUP_BONUS,
  rabbitmq: {
    uri: process.env.RABBITMQ_URI,
    mgmtPort: process.env.RABBITMQ_MGMPORT,
  }
};
