import * as Sentry from '@sentry/node';
import config from './config';

Sentry.init({
  dsn: 'https://4e5e8f8821354e6dbe2f3124c7a297f5@o438134.ingest.sentry.io/5402429',
  environment: config.env,
});
// if (config.env !== 'local') {
// }

export default Sentry;
