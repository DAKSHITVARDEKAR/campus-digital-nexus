import multer from 'multer';
import path from 'path';
import { storage, BUCKET_ID } from '../config/appwrite';
import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import { ID } from 'node-appwrite';
import { InputFile } from 'node-appwrite/file';
// Configure local storage for multer (temporary storage before Appwrite upload)
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

// Upload file to Appwrite Storage
export const uploadToAppwrite = async (localFilePath: string, destinationPath: string, metadata: any = {}) => {
  try {
    // Read the file as a buffer
    const fileBuffer = fs.readFileSync(localFilePath);
    
    // Create a unique filename
    const uniqueFilename = `${destinationPath}/${uuidv4()}${path.extname(localFilePath)}`;
    
    // Upload file to Appwrite Storage using InputFile
    const fileId = ID.unique();
    const file = await storage.createFile(
      BUCKET_ID,
      fileId,
      InputFile.fromBuffer(
        fileBuffer,
        metadata.originalname || path.basename(localFilePath)
      )
    );
    
    // Get public URL - need to await the promise
    const fileUrlPromise = storage.getFileView(BUCKET_ID, fileId);
    const fileUrl = await fileUrlPromise;
    
    // Clean up local file if needed
    try {
      fs.unlinkSync(localFilePath);
    } catch (err) {
      console.warn('Could not delete temporary file:', err);
    }
    
    return { 
      id: fileId,
      url: fileUrl, 
      path: fileId,
      filename: file.name,
      contentType: metadata.mimetype || 'application/octet-stream',
      description: metadata.description || '',
      altText: metadata.altText || ''
    };
  } catch (error) {
    // Clean up local file in case of error
    try {
      fs.unlinkSync(localFilePath);
    } catch (err) {
      console.warn('Could not delete temporary file:', err);
    }
    
    console.error('Error uploading file to Appwrite:', error);
    throw error;
  }
};
