import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { account, databases, DATABASE_ID, USERS_COLLECTION_ID } from '../config/appwrite';
import { ID, Query } from 'node-appwrite';

// Validation schemas using Zod
const registerSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
  role: z.enum(['STUDENT', 'FACULTY', 'ADMIN']),
  department: z.string().optional(),
});

const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

// Register a new user
export const register = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validatedData = registerSchema.safeParse(req.body);
    
    if (!validatedData.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid registration data. Please check your information and try again.',
        errors: validatedData.error.errors
      });
    }
    
    const { username, email, password, name, role, department } = validatedData.data;
    
    // Check if user already exists in Appwrite
    try {
      const existingUsers = await databases.listDocuments(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        [
          Query.equal('email', email)
        ]
      );
      
      if (existingUsers.total > 0) {
        return res.status(409).json({
          success: false,
          message: 'A user with this email already exists. Please try a different email.'
        });
      }
      
      // Check username uniqueness
      const existingUsernames = await databases.listDocuments(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        [
          Query.equal('username', username)
        ]
      );
      
      if (existingUsernames.total > 0) {
        return res.status(409).json({
          success: false,
          message: 'This username is already taken. Please choose a different username.'
        });
      }
      
      // Create user account in Appwrite
      const appwriteUser = await account.create(
        ID.unique(),
        email,
        password,
        name
      );
      
      // Hash password for our user profile document
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create user profile document
      const userData = {
        userId: appwriteUser.$id,
        username,
        email,
        name,
        hashedPassword, // Store hashed password for custom authentication if needed
        role,
        department: department || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Store user profile in Appwrite database
      const userProfile = await databases.createDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        ID.unique(),
        userData
      );
      
      // Generate JWT token
      const token = jwt.sign(
        { 
          id: appwriteUser.$id, 
          email: appwriteUser.email,
          username,
          role
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '30d' }
      );
      
      // Return user data without sensitive information
      const userResponse = {
        id: appwriteUser.$id,
        username,
        email,
        name,
        role,
        department: department || null,
        token
      };
      
      return res.status(201).json({
        success: true,
        message: 'Account created successfully. You can now log in.',
        data: userResponse
      });
    } catch (error: any) {
      console.error('Appwrite registration error:', error);
      return res.status(400).json({
        success: false,
        message: error.message || 'Error creating user',
        error: error.code
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred during registration. Please try again later.',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Login user
export const login = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validatedData = loginSchema.safeParse(req.body);
    
    if (!validatedData.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid login data. Please provide a valid username and password.',
        errors: validatedData.error.errors
      });
    }
    
    const { username, password } = validatedData.data;
    
    try {
      // Find user by username
      const userQuery = await databases.listDocuments(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        [
          Query.equal('username', username)
        ]
      );
      
      if (userQuery.total === 0) {
        return res.status(401).json({
          success: false,
          message: 'Invalid username or password. Please check your credentials and try again.'
        });
      }
      
      const userProfile = userQuery.documents[0];
      
      // Verify password using bcrypt
      const isPasswordValid = await bcrypt.compare(password, userProfile.hashedPassword);
      
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid username or password. Please check your credentials and try again.'
        });
      }
      
      // Try Appwrite session login
      try {
        await account.createEmailSession(userProfile.email, password);
      } catch (sessionError) {
        console.warn('Could not create Appwrite session:', sessionError);
        // Continue with JWT login even if Appwrite session fails
      }
      
      // Generate JWT token
      const token = jwt.sign(
        { 
          id: userProfile.userId, 
          email: userProfile.email,
          username: userProfile.username,
          role: userProfile.role
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '30d' }
      );
      
      return res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: userProfile.userId,
            username: userProfile.username,
            email: userProfile.email,
            name: userProfile.name,
            role: userProfile.role,
            department: userProfile.department || null
          },
          token
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({
        success: false,
        message: 'An error occurred during login. Please try again later.',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred during login. Please try again later.',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get current user profile
export const getProfile = async (req: Request, res: Response) => {
  try {
    // User should be attached by the auth middleware
    const user = (req as any).user;
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }
    
    // Get full user profile from database
    const userProfile = await databases.listDocuments(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      [
        Query.equal('userId', user.id)
      ]
    );
    
    if (userProfile.total === 0) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found'
      });
    }
    
    const profile = userProfile.documents[0];
    
    return res.status(200).json({
      success: true,
      data: {
        id: profile.userId,
        username: profile.username,
        email: profile.email,
        name: profile.name,
        role: profile.role,
        department: profile.department || null,
        createdAt: profile.createdAt
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving your profile. Please try again later.',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Logout user
export const logout = async (req: Request, res: Response) => {
  try {
    // Attempt to delete the current Appwrite session
    try {
      await account.deleteSession('current');
    } catch (error) {
      // Ignore errors, as the user might not have an active session
    }
    
    return res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred during logout. Please try again later.',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
