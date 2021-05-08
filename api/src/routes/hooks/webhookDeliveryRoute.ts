import { NextFunction, Response, Request } from 'express';
import { CampaignService, DeliveryUpdateItemProps } from '../../models/Campaigns/CampaignService';

export const webhookDeliveryRoute = async (req: Request, res: Response) => {
    const deliveryItems = req.body as DeliveryUpdateItemProps[];
    await CampaignService.updateBatchDeliveries(deliveryItems);

    res.status(200).end();
};