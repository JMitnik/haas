import 'mobx-react-lite/batchingForReactDom';
import { worker } from 'tests/mocks/browser';
import React from 'react';
import ReactDOM from 'react-dom';

import 'layouts/index.css';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/apm';

import App from './pages';

const sentryDSN = process.env.SENTRY_DSN || 'https://0530140060cb4ffaa6cea16b258866c0@o438134.ingest.sentry.io/5401517';

Sentry.init({
  dsn: sentryDSN,
  integrations: [
    new Integrations.Tracing(),
  ],
  tracesSampleRate: 1.0,
});

if (process.env.NODE_ENV === 'test') {
  worker.start({
    waitUntilReady: true,
  }).then(() => {
    ReactDOM.render(<App />, document.getElementById('root'));
  });
} else {
  ReactDOM.render(<App />, document.getElementById('root'));
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
