
import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Utility to handle async Express route handlers
 * This ensures that Express handlers properly handle promises and catch any errors
 */
export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>): RequestHandler => 
  (req: Request, res: Response, next: NextFunction): void => {
    // Execute the async function and ensure we handle the promise properly
    // We must not return the promise - Express expects void
    Promise.resolve(fn(req, res, next))
      .catch(next) // Pass any errors to Express error handling middleware
      .then(() => {}); // Ensure we don't return anything from the promise chain
  };
