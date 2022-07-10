import Redis from 'ioredis';
import config from './config';

export const redis = new Redis(config.redisUrl);

redis.on('connect', () => {
  console.log('Connected to Redis');
})
