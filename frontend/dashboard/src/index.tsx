import React from 'react';
import ReactDOM from 'react-dom';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import sentryInstance from 'config/sentry';

import * as serviceWorker from './serviceWorker';
import App from './App';

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// change

serviceWorker.register({
  onUpdate: (registration) => {
    alert('New version of HAAS available. We are going to update!');
    if (registration && registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
    window.location.reload();
  },
});
