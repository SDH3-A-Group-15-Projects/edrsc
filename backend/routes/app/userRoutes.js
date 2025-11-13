import express from 'express';
import AppUserController from '../../controllers/appUserController.js';
import authenticateToken from '../../middleware/authenticateToken.js';

const router = express.Router();

router.get('/:uid/profile', authenticateToken, AppUserController.getUserProfile);
router.post('/:uid/profile', authenticateToken, AppUserController.createUserProfile);
router.put('/:uid/profile', authenticateToken, AppUserController.updateUserProfile);
router.delete('/:uid/profile', authenticateToken, AppUserController.deleteUserProfile);

export default router;