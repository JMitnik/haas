import prisma from './config/prisma';
import config from './config/config';
import { makeServer } from './config/server';

try {
  console.log('Starting app');
  makeServer(config.port, prisma);
} catch (e) {
  console.log(e);
}
