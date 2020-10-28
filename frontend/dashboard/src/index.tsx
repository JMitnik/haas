import { useToast } from '@chakra-ui/core';
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
const toast = useToast();


serviceWorker.register({
  onUpdate: (registration) => {
    toast({
      title: 'New version available!',
      description: 'Closing this popup will reload the page',
      status: 'info',
      position: 'top',
      isClosable: true,
      onClose: () => {
        if (registration && registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
        window.location.reload();
      },
    });
  },
});
