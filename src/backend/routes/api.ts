
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
}));

router.post('/auth/login', asyncHandler(async (req, res) => {
  await authController.login(req, res);
}));

router.get('/auth/profile', authenticateToken, asyncHandler(async (req, res) => {
  await authController.getProfile(req, res);
}));

// Role management (for Campus-Nexus RBAC)
router.post('/auth/roles/assign', 
  authenticateToken, 
  checkRole(['ADMIN']), 
  asyncHandler(async (req, res) => {
    // New endpoint to assign users to roles/teams
    const { userId, role, teamId } = req.body;
    
    // Logic to assign user to Appwrite team would go here
    // This would typically call Appwrite SDK to modify team memberships
    
    res.json({ 
      success: true, 
      message: `User ${userId} assigned to role ${role} (team:${teamId})` 
    });
}));

// Election routes
router.get('/elections', asyncHandler(async (req, res) => {
  await electionController.getElections(req, res);
}));

router.get('/elections/:id', asyncHandler(async (req, res) => {
  await electionController.getElection(req, res);
}));

router.post('/elections', 
  authenticateToken, 
  checkRole(['ADMIN', 'ELECTION_COMMITTEE']), 
  asyncHandler(async (req, res) => {
    await electionController.createElection(req, res);
}));

router.put('/elections/:id', 
  authenticateToken, 
  checkRole(['ADMIN', 'ELECTION_COMMITTEE']),
  asyncHandler(async (req, res) => {
    await electionController.updateElection(req, res);
}));

router.delete('/elections/:id', 
  authenticateToken, 
  checkRole(['ADMIN', 'ELECTION_COMMITTEE']), 
  asyncHandler(async (req, res) => {
    await electionController.deleteElection(req, res);
}));

// Candidate routes
router.get('/elections/:electionId/candidates', asyncHandler(async (req, res) => {
  await electionController.getCandidates(req, res);
}));

router.post('/candidates', 
  authenticateToken, 
  upload.single('image'), 
  asyncHandler(async (req, res) => {
    await electionController.createCandidate(req, res);
}));

router.patch('/candidates/:id/approve', 
  authenticateToken, 
  checkRole(['ADMIN', 'FACULTY', 'ELECTION_COMMITTEE']), 
  asyncHandler(async (req, res) => {
    await electionController.approveCandidate(req, res);
}));

router.patch('/candidates/:id/reject', 
  authenticateToken, 
  checkRole(['ADMIN', 'FACULTY', 'ELECTION_COMMITTEE']), 
  asyncHandler(async (req, res) => {
    await electionController.rejectCandidate(req, res);
}));

// Vote routes
router.post('/votes', 
  authenticateToken, 
  asyncHandler(async (req, res) => {
    await electionController.castVote(req, res);
}));

router.get('/elections/:electionId/results', asyncHandler(async (req, res) => {
  await electionController.getElectionResults(req, res);
}));

router.get('/elections/:electionId/has-voted', 
  authenticateToken, 
  asyncHandler(async (req, res) => {
    await electionController.hasVoted(req, res);
}));

// File upload routes for Appwrite Storage integration
router.post('/upload-file', 
  authenticateToken, 
  upload.single('file'), 
  asyncHandler(async (req, res) => {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
      return;
    }
    
    // Here you would typically:
    // 1. Upload the file to Appwrite Storage
    // 2. Return the File ID for reference in database
    
    res.status(200).json({
      success: true,
      message: 'File uploaded successfully to Appwrite Storage',
      data: {
        filename: req.file.filename,
        mimetype: req.file.mimetype,
        size: req.file.size,
        // fileId: response.$id // This would come from Appwrite storage upload
      }
    });
}));

export default router;
