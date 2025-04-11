
import express from 'express';
import { authenticateToken, checkRole } from '../middleware/auth';
import * as authController from '../controllers/authController';
import * as electionController from '../controllers/electionController';

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
router.post('/candidates', authenticateToken, electionController.createCandidate);
router.patch('/candidates/:id/approve', authenticateToken, checkRole(['ADMIN', 'FACULTY']), electionController.approveCandidate);
router.patch('/candidates/:id/reject', authenticateToken, checkRole(['ADMIN', 'FACULTY']), electionController.rejectCandidate);

// Vote routes
router.post('/votes', authenticateToken, electionController.castVote);
router.get('/elections/:electionId/results', electionController.getElectionResults);
router.get('/elections/:electionId/has-voted', authenticateToken, electionController.hasVoted);

export default router;
