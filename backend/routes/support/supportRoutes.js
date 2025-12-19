import express from 'express';
import SupportController from '../../controllers/supportController.js';
import authenticateToken from '../../middleware/authenticateToken.js';

const router = express.Router();

router.post('/:uid', authenticateToken, SupportController.submitSupportRequest);

router.get('/', authenticateToken, SupportController.getAllSupportRequests);

export default router;