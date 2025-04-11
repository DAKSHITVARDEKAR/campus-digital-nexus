
import express from 'express';
import { authenticateToken, checkRole } from '../middleware/auth';
import * as authController from '../controllers/authController';
import * as electionController from '../controllers/electionController';
import { upload } from '../utils/fileUpload';

const router = express.Router();

// Auth routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/profile', authenticateToken, authController.getProfile);

// Election routes
router.get('/elections', electionController.getElections);
router.get('/elections/:id', electionController.getElection);
router.post('/elections', authenticateToken, checkRole(['ADMIN']), electionController.createElection);
router.put('/elections/:id', authenticateToken, electionController.updateElection);
router.delete('/elections/:id', authenticateToken, checkRole(['ADMIN']), electionController.deleteElection);

// Candidate routes
router.get('/elections/:electionId/candidates', electionController.getCandidates);
router.post('/candidates', authenticateToken, upload.single('profileImage'), electionController.createCandidate);
router.patch('/candidates/:id/approve', authenticateToken, checkRole(['ADMIN', 'FACULTY']), electionController.approveCandidate);
router.patch('/candidates/:id/reject', authenticateToken, checkRole(['ADMIN', 'FACULTY']), electionController.rejectCandidate);

// Vote routes
router.post('/votes', authenticateToken, electionController.castVote);
router.get('/elections/:electionId/results', electionController.getElectionResults);
router.get('/elections/:electionId/has-voted', authenticateToken, electionController.hasVoted);

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
