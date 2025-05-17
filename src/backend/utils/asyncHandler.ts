
import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Utility to handle async Express route handlers
 * This ensures that Express handlers properly handle promises and catch any errors
 */
export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Using Promise.resolve to handle both Promise and non-Promise returns
    Promise.resolve(fn(req, res, next))
      .catch((err) => {
        next(err);
      });
  };
};
