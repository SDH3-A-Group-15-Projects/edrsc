import express from 'express';
import cors from 'cors';

import webUserRoutes from './routes/web/userRoutes.js';
import appUserRoutes from './routes/app/userRoutes.js';
import adminRoutes from './routes/admin/adminRoutes.js';
// import aiUserRoutes from './routes/ai/userRoutes.js';
import supportRoutes from './routes/support/supportRoutes.js';

const expressApp = express();
const port = process.env.PORT || 3001;

expressApp.use(cors());
expressApp.use(express.json());

expressApp.use('/api/web/users', webUserRoutes);
expressApp.use('/api/app/users', appUserRoutes);
expressApp.use('/api/admin/', adminRoutes);
expressApp.use('/api/support/', supportRoutes);

expressApp.listen(port, '0.0.0.0', () => console.log(`Express app listening on ${port}`));
