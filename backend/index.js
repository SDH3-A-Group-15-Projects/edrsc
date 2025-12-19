import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';

import webUserRoutes from './routes/web/userRoutes.js';
import appUserRoutes from './routes/app/userRoutes.js';
import adminRoutes from './routes/admin/adminRoutes.js';
import paymentRoutes from './routes/web/payment.js';
import { stripeWebhook } from './controllers/paymentController.js';
import reportRoutes from './routes/web/report.js'

const expressApp = express();
const port = process.env.PORT || 3001;

expressApp.use(cors());

expressApp.post(
    '/api/web/payments/stripe-webhook',
    express.raw({ type: "application/json"}),
    stripeWebhook
);

expressApp.use(express.json());

expressApp.use('/api/web/users', webUserRoutes);
expressApp.use('/api/app/users', appUserRoutes);
expressApp.use('/api/admin/', adminRoutes);
expressApp.use('/api/web/payments', paymentRoutes);
expressApp.use('/api/report', reportRoutes);

expressApp.listen(port, console.log(`Express app listening on ${port}`));