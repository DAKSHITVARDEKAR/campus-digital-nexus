
import express from 'express';
import { authenticateToken, checkRole } from '../middleware/auth';
import * as authController from '../controllers/authController';
import * as electionController from '../controllers/electionController';
import { upload } from '../utils/fileUpload';
import { asyncHandler } from '../utils/asyncHandler';

const router = express.Router();

// Auth routes
router.post('/auth/register', asyncHandler((req, res) => {
  authController.register(req, res);
}));

router.post('/auth/login', asyncHandler((req, res) => {
  authController.login(req, res);
}));

router.get('/auth/profile', authenticateToken, asyncHandler((req, res) => {
  authController.getProfile(req, res);
}));

// Election routes
router.get('/elections', asyncHandler((req, res) => {
  electionController.getElections(req, res);
}));

router.get('/elections/:id', asyncHandler((req, res) => {
  electionController.getElection(req, res);
}));

router.post('/elections', authenticateToken, checkRole(['ADMIN']), asyncHandler((req, res) => {
  electionController.createElection(req, res);
}));

router.put('/elections/:id', authenticateToken, asyncHandler((req, res) => {
  electionController.updateElection(req, res);
}));

router.delete('/elections/:id', authenticateToken, checkRole(['ADMIN']), asyncHandler((req, res) => {
  electionController.deleteElection(req, res);
}));

// Candidate routes
router.get('/elections/:electionId/candidates', asyncHandler((req, res) => {
  electionController.getCandidates(req, res);
}));

router.post('/candidates', authenticateToken, upload.single('image'), asyncHandler((req, res) => {
  electionController.createCandidate(req, res);
}));

router.patch('/candidates/:id/approve', authenticateToken, checkRole(['ADMIN', 'FACULTY']), asyncHandler((req, res) => {
  electionController.approveCandidate(req, res);
}));

router.patch('/candidates/:id/reject', authenticateToken, checkRole(['ADMIN', 'FACULTY']), asyncHandler((req, res) => {
  electionController.rejectCandidate(req, res);
}));

// Vote routes
router.post('/votes', authenticateToken, asyncHandler((req, res) => {
  electionController.castVote(req, res);
}));

router.get('/elections/:electionId/results', asyncHandler((req, res) => {
  electionController.getElectionResults(req, res);
}));

router.get('/elections/:electionId/has-voted', authenticateToken, asyncHandler((req, res) => {
  electionController.hasVoted(req, res);
}));

// File upload test route
router.post('/upload-test', authenticateToken, upload.single('file'), asyncHandler((req, res) => {
  if (!req.file) {
    res.status(400).json({
      success: false,
      message: 'No file uploaded'
    });
    return;
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
}));

export default router;
