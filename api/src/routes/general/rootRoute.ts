import { NextFunction, Response, Request } from 'express';

export const rootRoute = (req: Request, res: Response, next: NextFunction) => {
  res.json({ status: 'HAAS API V2.1.0' });
}