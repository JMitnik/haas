// eslint-disable-next-line import/no-extraneous-dependencies
import { graphql, setupWorker } from 'msw';
import { handlers } from './handlers';
// This configures a Service Worker with the given request handlers.
export const worker = setupWorker(...handlers);

// @ts-ignore
window.msw = {
  worker,
  graphql,
};
