import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/apm';

const sentryDSN = process.env.SENTRY_DSN || 'https://9d2818fd373c47369bbb851f53b2a3c5@o438134.ingest.sentry.io/5404741';

const sentryInstance = Sentry.init({
  dsn: sentryDSN,
  integrations: [
    new Integrations.Tracing(),
  ],
  tracesSampleRate: 1.0,
});

export default sentryInstance;
