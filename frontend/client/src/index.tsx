import 'mobx-react-lite/batchingForReactDom';
import { worker } from 'tests/mocks/browser';
import React from 'react';
import ReactDOM from 'react-dom';

import 'layouts/index.css';

import App from './pages';

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
