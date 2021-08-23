import redis from 'redis';
import { promisify } from 'util';


export interface RedisClient {
  get: (arg: string) => Promise<string | null>;
  set: (arg1: string, arg2: string) => Promise<any>;
  expire: (arg1: string, arg2: number) => Promise<number>;
}

export const makeRedis = (redisUrl: string): RedisClient => {
  const originalClient = redis.createClient(redisUrl);

  return {
    get: promisify(originalClient.get).bind(originalClient),
    set: promisify(originalClient.set).bind(originalClient),
    expire: promisify(originalClient.expire).bind(originalClient)
  } as RedisClient;
}
