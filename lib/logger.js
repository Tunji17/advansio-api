const bunyan = require('bunyan');
const config = require('./config');

module.exports = bunyan.createLogger({
  name: 'advansio-api',
  level: config.logger.level,
});
