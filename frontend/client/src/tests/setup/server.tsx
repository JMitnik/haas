// eslint-disable-next-line import/no-extraneous-dependencies
import { setupWorker } from 'msw';

export const server = setupWorker();
server.start({ onUnhandledRequest: 'bypass' });
