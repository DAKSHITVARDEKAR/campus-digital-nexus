
import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Utility to handle async Express route handlers
 * This ensures that Express handlers properly handle promises and catch any errors
 */
export const asyncHandler = (fn: (req: Request, res: Response, next?: NextFunction) => Promise<any>): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // We need to execute the function and catch any errors, but we shouldn't return its result
    // Express middleware must return void
    Promise.resolve(fn(req, res, next))
      .catch(next) // Pass any errors to Express error handling middleware
      // Explicitly ignore any return value from the controller function
      .then(() => {}) // This ensures void return type
  };
};
