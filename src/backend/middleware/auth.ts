
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { auth, db } from '../config/firebase';
import { Client, Account, Teams, ID } from 'appwrite';

// Initialize Appwrite for server-side operations
const appwriteClient = new Client();
appwriteClient
  .setEndpoint('https://fra.cloud.appwrite.io/v1')
  .setProject('68166b45001f2c121a55');

// Create a server-side API key instance (the correct way to authenticate server-side)
// Instead of using setKey() which is not available on Client
const appwriteTeams = new Teams(appwriteClient);

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
      // Get user from Firestore
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
      
      // Try to check Appwrite team membership if integration is active
      try {
        const teamMemberships = await appwriteTeams.listMemberships(req.user.userId);
        const teamNames = teamMemberships.memberships.map(membership => membership.teamName);
        
        // Check if user is in any of the required teams/roles
        const hasAppwriteRole = roles.some(role => 
          teamNames.includes(`team:${role.toLowerCase()}`)
        );
        
        if (hasAppwriteRole) {
          // If user has role in Appwrite, allow access
          req.user.role = userRole; // Keep Firebase role for backward compatibility
          return next();
        }
      } catch (appwriteError) {
        // Fall back to Firebase roles if Appwrite check fails
        console.error('Appwrite team check failed, falling back to Firebase:', appwriteError);
      }
      
      // If Appwrite check failed or user doesn't have role in Appwrite,
      // check Firebase role as fallback
      if (!roles.includes(userRole)) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to access this resource. Please contact an administrator if you believe this is an error.',
          error: `Required role: ${roles.join(' or ')}. Your role: ${userRole}`
        });
      }
      
      // User has the required role in Firebase
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
