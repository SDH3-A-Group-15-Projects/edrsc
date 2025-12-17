import express from 'express';
import AdminController from '../../controllers/adminController.js';
import authenticateToken from '../../middleware/authenticateToken.js';

const router = express.Router();

router.get('/export', authenticateToken, AdminController.exportAnonymisedData);

router.get('/doctors', authenticateToken, AdminController.getAllDoctors);

export default router;