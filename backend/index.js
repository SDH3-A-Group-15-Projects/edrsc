const { initializeApp, applicationDefault } = require('firebase-admin/app');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const webUserRoutes = require('./routes/web/userRoutes');
const appUserRoutes = require('./routes/app/userRoutes');

dotenv.config();

initializeApp({
  credential: applicationDefault(),
  databaseURL: process.env.DATABASE_URL
});

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/web', webUserRoutes);
app.use('api/app', appUserRoutes);

app.listen(port, () => console.log('Express app listening on ${port}\\'))