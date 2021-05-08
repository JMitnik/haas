import { CorsOptions } from 'cors';
import config from './config';

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    callback(null, true);
    const validOrigins = ['http://localhost:3002', 'https://192.168.68.114:3000/', 'dashboard.haas.live', 'client.haas.live', 'haas-dashboard.netlify.app', 'haas-client.netlify.app'];

    if (config.env === 'local' || (origin && validOrigins.find((origin: string) => origin.endsWith(origin)))) {
      // callback(null, true);
    }
  },
  credentials: true,
};