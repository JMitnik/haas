import { Logger, Environment } from '../models/Common/Logger/Logger';
export { LifeCycleType } from '../models/Common/Logger/Logger';

export const logger = new Logger(process.env.NODE_ENV as Environment, false);
