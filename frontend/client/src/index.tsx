import 'config/sentry';
import 'mobx-react-lite/batchingForReactDom';

import React from 'react';
import ReactDOM from 'react-dom';
import 'layouts/index.css';

import App from './pages';

console.log(process.env.ENV);

if (process.env.REACT_APP_ENV && process.env.REACT_APP_ENV === 'test') {
  // TODO: Figure out how to get MSW working okay
  // worker.start({
  //   waitUntilReady: true,
  //   onUnhandledRequest: 'bypass',
  //   serviceWorker: { options: { scope: 'http://localhost:4000/graphql' } }
  // }).then(() => {
  //   ReactDOM.render(<App />, document.getElementById('root'));
  // });
  ReactDOM.render(<App />, document.getElementById('root'));
} else {
  ReactDOM.render(<App />, document.getElementById('root'));
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
