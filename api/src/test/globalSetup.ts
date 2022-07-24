import { redis } from '../config/redis';
import { prisma } from '../test/setup/singletonDeps';


const teardown = async () => {
  await redis.quit();
  await prisma.$disconnect();
};

afterAll(async () => {
  await teardown();
});
