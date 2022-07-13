import { redis } from '../config/redis';

afterAll(async () => {
  await redis.quit();
})
