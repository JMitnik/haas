import { logger } from '../../../config/logger';
import Redis from 'ioredis';

export class RedisService {
  public redis: Redis;

  constructor(redis: Redis) {
    this.redis = redis;
  }

  get(key: string) {
    return this.redis.get(key);
  }

  async set(key: string, value: string | number) {
    try {
      const set = await this.redis.set(key, value);

      return set;
    } catch (error) {
      logger.error('Error setting redis', error);

      return Promise.resolve(() => {});
    }
  }
}
