
import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Utility to handle async Express route handlers
 * This ensures that Express handlers properly handle promises and catch any errors
 */
export const asyncHandler = (fn: (req: Request, res: Response, next?: NextFunction) => Promise<any>): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Express middleware must return void, so we void the promise result
    void Promise.resolve(fn(req, res, next))
      .catch(next); // Pass any errors to Express error handling middleware
    
    // No return value - this ensures void type for the RequestHandler
  };
};
