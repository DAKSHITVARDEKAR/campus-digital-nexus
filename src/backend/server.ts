
import express from 'express';
import cors from 'cors';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import apiRoutes from './routes/api';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  
  // User-friendly error message
  const message = err.message || 'An unexpected error occurred';
  
  // Include stack trace in development mode
  const details = process.env.NODE_ENV === 'development' ? err.stack : undefined;
  
  res.status(err.status || 500).json({
    success: false,
    message,
    details
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Connect to database and initialize
async function initializeApp() {
  try {
    await prisma.$connect();
    console.log('Connected to database successfully');
    
    // Setup database (for development)
    if (process.env.NODE_ENV === 'development') {
      // Add any initial setup here
      console.log('Database initialized for development');
    }
  } catch (error) {
    console.error('Failed to connect to database:', error);
    process.exit(1);
  }
}

initializeApp();

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  console.log('Disconnected from database');
  process.exit(0);
});

export default app;
