
const config = require('../../config');
const env = require('./index');

env.addGlobal('baseUrl', config.baseUrl);

module.exports = env;
