import { Response, Request } from 'express';

export const webhookRoute = async (req: Request, res: Response) => {
  res.send('success');
};