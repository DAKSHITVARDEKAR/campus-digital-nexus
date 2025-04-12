
import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Utility to handle async Express route handlers
 * This properly handles the Promise return type from controller functions by ensuring 
 * that the handler returns void as Express expects, while still properly handling 
 * promise rejection via the next() function.
 */
export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>): RequestHandler => 
  (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next))
      .catch(next); // Only catch errors, explicitly ignoring the resolved value
  };
