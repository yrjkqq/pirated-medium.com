import log from 'loglevel';

if (process.env.NODE_ENV === 'development') {
  log.setLevel('DEBUG');
}

export { log as bLog };
