
import { Request, Response, NextFunction, RequestHandler } from 'express';

// Modified utility to handle async Express route handlers
// This properly handles the Promise return type from controller functions
export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>): RequestHandler => 
  (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next))
      .then(() => {}) // Explicitly consume the promise result
      .catch(next);
  };
