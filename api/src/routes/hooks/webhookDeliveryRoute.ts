import { Response, Request } from 'express';
import { CampaignService, DeliveryUpdateItemProps } from '../../models/Campaigns/CampaignService';

interface WebhookDeliveryPayload {
  type: 'TEST' | 'TEST@';
  items: DeliveryUpdateItemProps[];
}

/**
 * Receives updates about multiple delivery types.
 * @param req
 * @param res
 */
export const webhookDeliveryRoute = async (req: Request<any, any, WebhookDeliveryPayload>, res: Response) => {
  const deliveryItems = req.body;
  await CampaignService.updateBatchDeliveries(deliveryItems.items);

  res.status(200).end();
};