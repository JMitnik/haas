import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';

const sentryDSN = 'https://32f3dd33528f4097a7f78423a4507c6b@o438134.ingest.sentry.io/5404741';

export const sentryInstance = Sentry.init({
    dsn: sentryDSN,
    // denyUrls: ['localhost', '127.0.0.1'],
    autoSessionTracking: true,
    integrations: [
        new Integrations.BrowserTracing(),
    ],
    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0,
});
