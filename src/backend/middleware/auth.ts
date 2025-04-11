
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { auth, db } from '../config/firebase';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: string;
      };
    }
  }
}

// Verify JWT token and attach user to request
export const authenticateToken = async (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'Authentication required. Please log in to access this resource.',
        error: 'No authentication token provided'
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    
    // Verify user exists in Firebase
    try {
      await auth.getUser(decoded.userId);
      
      // Attach user info to request
      req.user = {
        userId: decoded.userId,
        role: decoded.role
      };
      
      next();
    } catch (error) {
      return res.status(403).json({ 
        success: false,
        message: 'User not found or deleted. Please log in again.',
        error: 'Invalid user'
      });
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(403).json({ 
      success: false,
      message: 'Your login session is invalid or has expired. Please log in again.',
      error: 'Invalid authentication token'
    });
  }
};

// Check if user has required role
export const checkRole = (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in to access this resource.',
        error: 'User not authenticated'
      });
    }
    
    try {
      // Get user from Firestore to check current role
      const userDoc = await db.collection('users').doc(req.user.userId).get();
      
      if (!userDoc.exists) {
        return res.status(404).json({
          success: false,
          message: 'User not found. Your account may have been deleted.',
          error: 'User not found'
        });
      }
      
      const userData = userDoc.data();
      const userRole = userData?.role;
      
      if (!roles.includes(userRole)) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to access this resource. Please contact an administrator if you believe this is an error.',
          error: `Required role: ${roles.join(' or ')}. Your role: ${userRole}`
        });
      }
      
      // Update req.user with the latest role from Firestore
      req.user.role = userRole;
      
      next();
    } catch (error) {
      console.error('Role check error:', error);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while checking permissions.',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };
};

// Check if user has specific permission
export const checkPermission = (
  permissionCheck: (userId: string, resourceId?: string) => Promise<boolean>
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required. Please log in to access this resource.',
          error: 'User not authenticated'
        });
      }
      
      const resourceId = req.params.id;
      const hasPermission = await permissionCheck(req.user.userId, resourceId);
      
      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to perform this action on this resource.',
          error: 'Permission denied'
        });
      }
      
      next();
    } catch (error) {
      console.error('Permission check error:', error);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while checking permissions.',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };
};
