
import express from 'express';
import { authenticateToken, checkRole } from '../middleware/auth';
import * as authController from '../controllers/authController';
import * as electionController from '../controllers/electionController';
import { upload } from '../utils/fileUpload';

const router = express.Router();

// Auth routes
router.post('/auth/register', (req, res) => {
  authController.register(req, res);
});

router.post('/auth/login', (req, res) => {
  authController.login(req, res);
});

router.get('/auth/profile', authenticateToken, (req, res) => {
  authController.getProfile(req, res);
});

// Election routes
router.get('/elections', (req, res) => {
  electionController.getElections(req, res);
});

router.get('/elections/:id', (req, res) => {
  electionController.getElection(req, res);
});

router.post('/elections', authenticateToken, checkRole(['ADMIN']), (req, res) => {
  electionController.createElection(req, res);
});

router.put('/elections/:id', authenticateToken, (req, res) => {
  electionController.updateElection(req, res);
});

router.delete('/elections/:id', authenticateToken, checkRole(['ADMIN']), (req, res) => {
  electionController.deleteElection(req, res);
});

// Candidate routes
router.get('/elections/:electionId/candidates', (req, res) => {
  electionController.getCandidates(req, res);
});

router.post('/candidates', authenticateToken, upload.single('image'), (req, res) => {
  electionController.createCandidate(req, res);
});

router.patch('/candidates/:id/approve', authenticateToken, checkRole(['ADMIN', 'FACULTY']), (req, res) => {
  electionController.approveCandidate(req, res);
});

router.patch('/candidates/:id/reject', authenticateToken, checkRole(['ADMIN', 'FACULTY']), (req, res) => {
  electionController.rejectCandidate(req, res);
});

// Vote routes
router.post('/votes', authenticateToken, (req, res) => {
  electionController.castVote(req, res);
});

router.get('/elections/:electionId/results', (req, res) => {
  electionController.getElectionResults(req, res);
});

router.get('/elections/:electionId/has-voted', authenticateToken, (req, res) => {
  electionController.hasVoted(req, res);
});

// File upload test route
router.post('/upload-test', authenticateToken, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No file uploaded'
    });
  }
  
  return res.status(200).json({
    success: true,
    message: 'File uploaded successfully',
    data: {
      filename: req.file.filename,
      mimetype: req.file.mimetype,
      size: req.file.size
    }
  });
});

export default router;
