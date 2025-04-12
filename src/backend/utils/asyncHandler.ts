
import { Request, Response, NextFunction, RequestHandler } from 'express';

// Utility to wrap async route handlers and ensure proper TypeScript typing
export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>): RequestHandler => 
  (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next))
      .catch(next);
  };
