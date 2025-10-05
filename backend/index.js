const { initializeApp, applicationDefault } = require('firebase-admin/app');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const routes = require('./routes');
const authenticateToken = require('./middleware/authenticateToken');
//const errorHandler = require('./middleware/errorHandler');

dotenv.config();

initializeApp({
  credential: applicationDefault(),
  databaseURL: process.env.DATABASE_URL
});

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

app.use('/api', routes);

app.listen(port, () => console.log('Express app listening on ${port}\\'))