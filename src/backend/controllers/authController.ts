
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const prisma = new PrismaClient();

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
    
    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email }
        ]
      }
    });
    
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'A user with this username or email already exists. Please try a different username or email.'
      });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        hashedPassword,
        name,
        role,
        department
      },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        role: true,
        department: true
      }
    });
    
    return res.status(201).json({
      success: true,
      message: 'Account created successfully. You can now log in.',
      data: user
    });
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
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { username }
    });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password. Please check your credentials and try again.'
      });
    }
    
    // Verify password
    const validPassword = await bcrypt.compare(password, user.hashedPassword);
    
    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password. Please check your credentials and try again.'
      });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role
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
          id: user.id,
          username: user.username,
          email: user.email,
          name: user.name,
          role: user.role,
          department: user.department
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
    
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        role: true,
        department: true,
        createdAt: true
      }
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found. Your account may have been deleted.'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: user
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
