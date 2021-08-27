import express from 'express';
import { body, validationResult } from 'express-validator';

import { CampaignService } from '../../models/Campaigns/CampaignService';

const router = express.Router();

interface ReqBody {
  updates: any[];
}

/**
 * Update deliveries.
 */
router.post('/',
  // Middleware
  express.json(),
  body('updates').isArray().withMessage('Updates required'),

  async (req: express.Request<any, any, ReqBody>, res: express.Response) => {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }).send();
    }

    try {
      await CampaignService.updateBatchDeliveryStatus(req.body.updates);
      return res.status(200).end();
    } catch(e: unknown) {
      let msg = 'Error';

      if (e instanceof Error) {
        msg = e.message;
      }

      return res.status(400).json({ error: msg }).send(msg).end();
    }
  }
);

export default router;
