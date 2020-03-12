import { prisma, NodeType } from '../src/generated/prisma-client/index';
import makeStarbucks from './seeds/make-starbucks';
import makeMediamarkt from './seeds/make-mediamarkt';

const main = async () => {
  await makeStarbucks();
  // await makeMediamarkt();
};

main();
