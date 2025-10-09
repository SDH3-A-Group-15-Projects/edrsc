import express from 'express';
import Env from './env.config.js';
import cors from 'cors';
import webUserRoutes from './routes/web/userRoutes.js';
import appUserRoutes from './routes/app/userRoutes.js';
import FirebaseConfig from './utils/firebaseConfig.js';

const env = new Env();

const fb = FirebaseConfig.getFirebaseApp();

const isDevelopment = () => {
  return process.env.NODE_ENV === "development";
}

if (isDevelopment()) {
  await import('firebase/auth');
  const auth = fb.getAuth();
  connectAuthEmulator(auth, process.env.AUTH_URL);
}

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/web/users', webUserRoutes);
app.use('/api/app/users', appUserRoutes);

app.listen(port, () => console.log(`Express app listening on ${port}`));