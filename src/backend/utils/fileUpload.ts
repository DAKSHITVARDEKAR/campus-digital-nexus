
import multer from 'multer';
import path from 'path';
import { storage } from '../config/firebase';
import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';

// Configure local storage for multer (temporary storage before Firebase upload)
const localStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniquePrefix + '-' + file.originalname);
  }
});

// File filter
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Accept images, documents, and PDFs
  if (
    file.mimetype.startsWith('image/') ||
    file.mimetype === 'application/pdf' ||
    file.mimetype === 'application/msword' ||
    file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type. Please upload an image, PDF, or document.'));
  }
};

// Configure multer
export const upload = multer({
  storage: localStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Upload file to Firebase Storage
export const uploadToFirebase = async (localFilePath: string, destinationPath: string, metadata: any = {}) => {
  try {
    // Upload file to Firebase Storage
    const bucket = storage.bucket();
    const destination = `${destinationPath}/${uuidv4()}${path.extname(localFilePath)}`;
    
    // Upload with metadata
    await bucket.upload(localFilePath, {
      destination,
      metadata: {
        contentType: metadata.mimetype || 'application/octet-stream',
        metadata: {
          originalName: metadata.originalname || path.basename(localFilePath),
          description: metadata.description || '',
          altText: metadata.altText || '',
        }
      }
    });
    
    // Get public URL
    const file = bucket.file(destination);
    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: '03-01-2500' // Far future expiration
    });
    
    return { 
      url, 
      path: destination,
      filename: path.basename(destination),
      contentType: metadata.mimetype,
      description: metadata.description || '',
      altText: metadata.altText || ''
    };
  } catch (error) {
    console.error('Error uploading file to Firebase:', error);
    throw error;
  }
};
