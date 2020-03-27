import * as log4js from 'log4js';

log4js.configure({
  appenders: {
    default: {
      type: 'console',
      layout: {
        type: 'pattern',
        pattern: '%[[%d{yyyy-MM-dd hh:mm:ss.SSS}] [%p] %f{1}:%l%] - %m',
      },
    },
    pirated: { type: 'file', filename: 'logs/pirated.log' },
  },
  categories: {
    default: {
      appenders: ['default'],
      level: process.env.LOG_LEVEL,
      enableCallStack: true,
    },
    pirated: { appenders: ['pirated'], level: 'error' },
  },
});

const logger = log4js.getLogger(
  process.env.NODE_ENV === 'development' ? 'default' : 'pirated',
);

export default logger;
