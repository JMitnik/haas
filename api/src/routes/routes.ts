import bodyParser from 'body-parser';
import { Express } from 'express';

import { healthRoute } from './general/healthRoute';
import { rootRoute } from './general/rootRoute';
import { webhookDeliveryRoute } from './hooks/webhookDeliveryRoute';
import { webhookRoute } from './hooks/webhookRoute';

export const routes = (app: Express) => {
  // General routes
  app.get('/', rootRoute);
  app.get('/health', healthRoute);

  // Webhook routes
  app.post('/webhooks', bodyParser.json(), webhookRoute);
  app.post('/webhooks/delivery', bodyParser.json(), webhookDeliveryRoute);
}