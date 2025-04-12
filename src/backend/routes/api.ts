
import express from 'express';
import { authenticateToken, checkRole } from '../middleware/auth';
import * as authController from '../controllers/authController';
import * as electionController from '../controllers/electionController';
import { upload } from '../utils/fileUpload';
import { asyncHandler } from '../utils/asyncHandler';

const router = express.Router();

// Auth routes
router.post('/auth/register', asyncHandler(async (req, res) => {
  await authController.register(req, res);
  return undefined; // Explicitly return undefined to satisfy void return type
}));

router.post('/auth/login', asyncHandler(async (req, res) => {
  await authController.login(req, res);
  return undefined;
}));

router.get('/auth/profile', authenticateToken, asyncHandler(async (req, res) => {
  await authController.getProfile(req, res);
  return undefined;
}));

// Election routes
router.get('/elections', asyncHandler(async (req, res) => {
  await electionController.getElections(req, res);
  return undefined;
}));

router.get('/elections/:id', asyncHandler(async (req, res) => {
  await electionController.getElection(req, res);
  return undefined;
}));

router.post('/elections', authenticateToken, checkRole(['ADMIN']), asyncHandler(async (req, res) => {
  await electionController.createElection(req, res);
  return undefined;
}));

router.put('/elections/:id', authenticateToken, asyncHandler(async (req, res) => {
  await electionController.updateElection(req, res);
  return undefined;
}));

router.delete('/elections/:id', authenticateToken, checkRole(['ADMIN']), asyncHandler(async (req, res) => {
  await electionController.deleteElection(req, res);
  return undefined;
}));

// Candidate routes
router.get('/elections/:electionId/candidates', asyncHandler(async (req, res) => {
  await electionController.getCandidates(req, res);
  return undefined;
}));

router.post('/candidates', authenticateToken, upload.single('image'), asyncHandler(async (req, res) => {
  await electionController.createCandidate(req, res);
  return undefined;
}));

router.patch('/candidates/:id/approve', authenticateToken, checkRole(['ADMIN', 'FACULTY']), asyncHandler(async (req, res) => {
  await electionController.approveCandidate(req, res);
  return undefined;
}));

router.patch('/candidates/:id/reject', authenticateToken, checkRole(['ADMIN', 'FACULTY']), asyncHandler(async (req, res) => {
  await electionController.rejectCandidate(req, res);
  return undefined;
}));

// Vote routes
router.post('/votes', authenticateToken, asyncHandler(async (req, res) => {
  await electionController.castVote(req, res);
  return undefined;
}));

router.get('/elections/:electionId/results', asyncHandler(async (req, res) => {
  await electionController.getElectionResults(req, res);
  return undefined;
}));

router.get('/elections/:electionId/has-voted', authenticateToken, asyncHandler(async (req, res) => {
  await electionController.hasVoted(req, res);
  return undefined;
}));

// File upload test route
router.post('/upload-test', authenticateToken, upload.single('file'), asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400).json({
      success: false,
      message: 'No file uploaded'
    });
    return undefined;
  }
  
  res.status(200).json({
    success: true,
    message: 'File uploaded successfully',
    data: {
      filename: req.file.filename,
      mimetype: req.file.mimetype,
      size: req.file.size
    }
  });
  return undefined;
}));

export default router;
