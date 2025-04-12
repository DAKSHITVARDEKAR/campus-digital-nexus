
import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Utility to handle async Express route handlers
 * This ensures that Express handlers properly handle promises and catch any errors
 */
export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>): RequestHandler => 
  (req: Request, res: Response, next: NextFunction): void => {
    // Express middleware expects void, not a Promise
    // Execute the function but don't return the promise
    Promise.resolve(fn(req, res, next))
      .catch(next) // Pass any errors to Express error handling middleware
      .then(() => {}); // Explicitly ensure void return by not returning anything
  };
