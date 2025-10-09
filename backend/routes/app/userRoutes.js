import express from 'express';
import AppUserController from '../../controllers/appUserController.js';
import authenticateToken from '../../middleware/authenticateToken.js';

const router = express.Router();

router.get('/profile', authenticateToken, AppUserController.getUserProfile);
router.post('/profile', authenticateToken, AppUserController.createUserProfile);
router.put('/profile', authenticateToken, AppUserController.updateUserProfile);
router.delete('/profile', authenticateToken, AppUserController.deleteUserProfile);

export default router;