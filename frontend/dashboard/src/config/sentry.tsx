import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/apm';

const sentryDSN = process.env.SENTRY_DSN || 'https://0530140060cb4ffaa6cea16b258866c0@o438134.ingest.sentry.io/5401517';
const activeDsn = process.env.REACT_APP_ENVI === 'local' ? '' : sentryDSN;

const sentryInstance = Sentry.init({
  dsn: activeDsn,
  integrations: [
    new Integrations.Tracing(),
  ],
  tracesSampleRate: 1.0,
});

export default sentryInstance;
