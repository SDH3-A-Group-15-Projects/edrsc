import express from 'express';
import {
    createCheckoutSession,
    stripeWebhook,
} from '../../controllers/paymentController.js';
import stripe from '../../utils/stripe.js';

const router = express.Router();

router.post('/create-checkout-session', createCheckoutSession);
router.post('/stripe-webhook', express.raw({type: 'application/json'}), stripeWebhook);

export default router;