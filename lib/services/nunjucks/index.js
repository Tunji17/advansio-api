const nunjucks = require('nunjucks');

const NODE_ENV = process.env.NODE_ENV || 'development';

module.exports = nunjucks.configure('lib/views/emails', {
  watch: false,
  autoescape: false,
  noCache: NODE_ENV === 'development',
});
