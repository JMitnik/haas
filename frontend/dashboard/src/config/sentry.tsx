import * as Sentry from '@sentry/react';

const sentryDSN = 'https://0530140060cb4ffaa6cea16b258866c0@o438134.ingest.sentry.io/5401517';
const activeDsn = sentryDSN;

const sentryInstance = Sentry.init({
  dsn: activeDsn,
  integrations: [
    // new Integrations.Tracing(),
  ],
  tracesSampleRate: 1.0,
});

export default sentryInstance;
