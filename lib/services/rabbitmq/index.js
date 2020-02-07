const rabbot = require('rabbot');
const { rabbitmq } = require('../../config');
const logger = require('../../logger');

rabbot.configure({
  connection: {
    uri: rabbitmq.uri,
    timeout: 20000,
  },
  exchanges: [
    {
      name: 'registration', autoDelete: false, durable: true, subscribe: true,
    },
    {
      name: 'transferSuccess', autoDelete: false, durable: true, subscribe: true,
    },
    {
      name: 'retry', type: 'topic', persistent: true, durable: true,
    },
  ],
  queues: [
    {
      name: 'registration', autoDelete: false, durable: true, subscribe: true,
    },
    {
      name: 'transferSuccess', autoDelete: false, durable: true, subscribe: true,
    },
    {
      name: 'retry-ready', autoDelete: false, durable: true, subscribe: true,
    },
    {
      name: 'retry-1',
      autoDelete: false,
      durable: true,
      messageTtl: 50,
      deadLetter: 'retry',
    },
    {
      name: 'retry-2',
      autoDelete: false,
      durable: true,
      messageTtl: 500,
      deadLetter: 'retry',
    },
    {
      name: 'retry-3',
      autoDelete: false,
      durable: true,
      messageTtl: 5000,
      deadLetter: 'retry',
    },
    {
      name: 'retry-4',
      autoDelete: false,
      durable: true,
      messageTtl: 50000,
      deadLetter: 'retry',
    },
    {
      name: 'retry-5',
      autoDelete: false,
      durable: true,
      messageTtl: 500000,
      deadLetter: 'retry',
    },
  ],
  bindings: [
    { exchange: 'registration', target: 'registration', keys: ['registration'] },
    { exchange: 'transferSuccess', target: 'transferSuccess', keys: ['transferSuccess'] },
    { exchange: 'retry', target: 'retry-ready', keys: ['*'] },
  ]
});

const handle = (handler, { retry = true } = {}) => async (message) => {
  try {
    await handler(message);
  } catch (e) {
    const retryNumber = (message.properties.headers['x-retry-count'] || 0) + 1;

    if (!retry || retryNumber > 5) {
      logger.warn('Permanent task failure', message);
      return;
    }

    const routingKey = `retry-${retryNumber}`;

    const { exchange: originalExchange, routingKey: originalRoutingKey } = message.fields;

    logger.info(`Got an error processing a message, waiting on ${routingKey}`, e, { originalExchange, originalRoutingKey });

    rabbot.publish('', {
      routingKey,
      body: message.body,
      headers: {
        'x-retry-count': retryNumber,
        'x-original-exchange': originalExchange,
        'x-original-routing-key': originalRoutingKey,
      },
    });
  } finally {
    message.ack();
  }
};

module.exports = {
  handle,
};
