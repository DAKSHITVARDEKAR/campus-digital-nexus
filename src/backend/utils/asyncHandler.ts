
import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Utility to handle async Express route handlers
 * This properly handles the Promise return type from controller functions
 * by ensuring that any promise is properly awaited and any errors are passed to next()
 */
export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>): RequestHandler => 
  (req: Request, res: Response, next: NextFunction): void => {
    // Express expects middleware to return void, so we wrap the async
    // function call and explicitly ignore its return value
    Promise.resolve(fn(req, res, next))
      .catch(next); // Only catch errors, explicitly ignoring the resolved value
  };
