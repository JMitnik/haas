import Redis from 'ioredis';

export class RedisService {
  public redis: Redis;

  constructor(redis: Redis) {
    this.redis = redis;
  }

  get(key: string) {
    return this.redis.get(key);
  }

  set(key: string, value: string | number) {
    return this.redis.set(key, value);
  }
}
