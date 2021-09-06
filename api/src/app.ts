import prisma from './config/prisma';
import config from './config/config';
import { makeServer } from './config/server';

process.on('SIGINT', () => {
  console.log('received sigint');
  setTimeout(() => {
    console.log('exit');
    process.exit(0);
  }, 100);
});

try {
  console.log('Starting app');
  makeServer(config.port, prisma);
} catch (e) {
  console.log(e);
}
