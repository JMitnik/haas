import { NextFunction, Response, Request } from 'express';

export const healthRoute = (req: Request, res: Response, next: NextFunction) => {
  res.json({ status: 'Health check Ok!' });
}