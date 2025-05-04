import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { account, databases, DATABASE_ID, USERS_COLLECTION_ID } from '../config/appwrite';
import { Query } from 'node-appwrite';

// Extended request interface with user property
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    username?: string;
    role: string;
  }
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;
  
  // Check if token exists in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
      
      // Verify token
      const decoded = jwt.verify(
        token, 
        process.env.JWT_SECRET || 'your-secret-key'
      ) as any;
      
      // Add user to request
      req.user = {
        id: decoded.id,
        email: decoded.email,
        username: decoded.username,
        role: decoded.role
      };
      
      next();
    } catch (error) {
      console.error('Authentication error:', error);
      res.status(401).json({
        success: false,
        message: 'Not authorized, token failed'
      });
    }
  } else {
    // Try Appwrite session if no token is provided
    try {
      const session = await account.getSession('current');
      
      // If session exists, get the user details from Appwrite
      if (session) {
        const appwriteUser = await account.get();
        
        // Get user profile from database
        const userQuery = await databases.listDocuments(
          DATABASE_ID,
          USERS_COLLECTION_ID,
          [
            Query.equal('userId', appwriteUser.$id)
          ]
        );
        
        if (userQuery.total > 0) {
          const userProfile = userQuery.documents[0];
          req.user = {
            id: appwriteUser.$id,
            email: appwriteUser.email,
            username: userProfile.username,
            role: userProfile.role
          };
          
          next();
          return;
        }
      }
      
      // No valid session or profile found
      res.status(401).json({
        success: false,
        message: 'Not authorized, please log in'
      });
    } catch (error) {
      console.error('Authentication error:', error);
      res.status(401).json({
        success: false,
        message: 'Not authorized, please log in'
      });
    }
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this resource`
      });
    }
    
    next();
  };
};
