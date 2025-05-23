
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { auth, db } from '../config/firebase';

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
    
    // Check if user already exists in Firestore
    const usersRef = db.collection('users');
    const usernameQuery = await usersRef.where('username', '==', username).get();
    const emailQuery = await usersRef.where('email', '==', email).get();
    
    if (!usernameQuery.empty || !emailQuery.empty) {
      return res.status(409).json({
        success: false,
        message: 'A user with this username or email already exists. Please try a different username or email.'
      });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create Firebase auth user
    try {
      const userRecord = await auth.createUser({
        email,
        password,
        displayName: name,
      });
      
      // Set custom claims for role
      await auth.setCustomUserClaims(userRecord.uid, { role });
      
      // Create user in Firestore
      const userData = {
        id: userRecord.uid,
        username,
        email,
        name,
        hashedPassword,
        role,
        department: department || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      await db.collection('users').doc(userRecord.uid).set(userData);
      
      // Return user data without sensitive information
      const userResponse = {
        id: userRecord.uid,
        username,
        email,
        name,
        role,
        department: department || null
      };
      
      return res.status(201).json({
        success: true,
        message: 'Account created successfully. You can now log in.',
        data: userResponse
      });
    } catch (error: any) {
      // Handle Firebase Auth specific errors
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
    
    // Find user by username in Firestore
    const usersRef = db.collection('users');
    const userQuery = await usersRef.where('username', '==', username).limit(1).get();
    
    if (userQuery.empty) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password. Please check your credentials and try again.'
      });
    }
    
    const userDoc = userQuery.docs[0];
    const userData = userDoc.data();
    
    // Verify password
    const validPassword = await bcrypt.compare(password, userData.hashedPassword);
    
    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password. Please check your credentials and try again.'
      });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      {
        userId: userDoc.id,
        role: userData.role
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
    
    return res.status(200).json({
      success: true,
      message: 'Login successful. Welcome back!',
      data: {
        token,
        user: {
          id: userDoc.id,
          username: userData.username,
          email: userData.email,
          name: userData.name,
          role: userData.role,
          department: userData.department
        }
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
};

// Get current user profile
export const getProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in to access your profile.'
      });
    }
    
    // Get user from Firestore
    const userDoc = await db.collection('users').doc(req.user.userId).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'User not found. Your account may have been deleted.'
      });
    }
    
    const userData = userDoc.data();
    
    // Return user data without sensitive information
    const userResponse = {
      id: userDoc.id,
      username: userData?.username,
      email: userData?.email,
      name: userData?.name,
      role: userData?.role,
      department: userData?.department,
      createdAt: userData?.createdAt
    };
    
    return res.status(200).json({
      success: true,
      data: userResponse
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
