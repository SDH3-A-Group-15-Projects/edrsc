import { initializeApp, applicationDefault } from 'firebase-admin/app';
const express = require('express');
import Env from './env.config.js';
const cors = require('cors');
import * as webUserRoutes from './routes/web/userRoutes.js';
import * as appUserRoutes from './routes/app/userRoutes.js';

const env = new Env();

const isDevelopment = () => {
  return process.env.NODE_ENV === "development";
}

if (isDevelopment()) {
  await import('firebase/auth');

  const auth = getAuth();
  connectAuthEmulator(auth, process.env.AUTH_URL);
}

initializeApp({
  credential: applicationDefault(),
  databaseURL: process.env.DATABASE_URL
});

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/web/users', webUserRoutes);
app.use('/api/app/users', appUserRoutes);

app.listen(port, () => console.log('Express app listening on ${port}\\'));