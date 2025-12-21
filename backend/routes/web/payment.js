import express from 'express';
import {
    createCheckoutSession,
    checkPayment,
    verifyPayment,
} from '../../controllers/paymentController.js';

const router = express.Router();


router.post('/create-checkout-session', createCheckoutSession);

router.get('/check/:patientId', checkPayment);


router.get('/verify/:patientId', verifyPayment);


export default router;