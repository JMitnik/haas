import Redis from 'ioredis';
import config from './config';
import { logger } from './logger';

export const redis = new Redis(config.redisUrl);

redis.on('connect', () => {
  logger.logLifeCycle('Connected to Redis');
});
