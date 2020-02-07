const logger = require('./logger');

logger.info('Starting Workers ....');

require('./workers/register');
require('./workers/transferSuccess');
