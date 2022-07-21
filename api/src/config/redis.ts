import Redis from 'ioredis';
import config from './config';
import { logger } from './logger';

export const redis = new Redis({
  path: config.redisUrl,
  lazyConnect: true,
});

redis.on('connect', () => {
  logger.logLifeCycle('Connected to Redis');
});
