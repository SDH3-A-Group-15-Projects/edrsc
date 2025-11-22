import express from 'express';
import AppUserController from '../../controllers/appUserController.js';
import authenticateToken from '../../middleware/authenticateToken.js';
import handleAudioUpload from '../../middleware/handleAudioUpload.js';

const router = express.Router();

router.get('/:uid/profile', authenticateToken, AppUserController.getUserProfile);
router.post('/:uid/profile', authenticateToken, AppUserController.createUserProfile);
router.put('/:uid/profile', authenticateToken, AppUserController.updateUserProfile);
router.delete('/:uid/profile', authenticateToken, AppUserController.deleteUserProfile);

router.post('/:uid/results/questionnaire', authenticateToken, AppUserController.submitQuestionnaire);

router.post('/:uid/results/voice', authenticateToken, handleAudioUpload, AppUserController.submitVoice);

router.post('/:uid/results/riskfactors', authenticateToken, AppUserController.submitRiskFactors);

export default router;