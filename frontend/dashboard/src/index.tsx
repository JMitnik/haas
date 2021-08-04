/* eslint-disable no-alert */
/* eslint-disable no-restricted-globals */
import 'config/sentry';
import React from 'react';
import ReactDOM from 'react-dom';

import * as serviceWorker from './serviceWorker';
import App from './App';

if (import.meta.env.VITE_IS_MSW === 'true') {
  // eslint-disable-next-line global-require
  const { worker } = require('./mocks/browser');
  worker.start();
}

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
if (import.meta.env.PROD) {
  serviceWorker.register({
    onUpdate: (registration) => {
      if (confirm('New version of HAAS available. Do you want to update?')) {
        if (registration && registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
        window.location.reload();
      }
    },
  });
} else {
  serviceWorker.unregister();
}
