import express from 'express';
import { getDatabase } from 'firebase-admin/database';
import { authenticateToken } from './authMiddleware';

const app = express();
app.use(express.json());

const db = getDatabase();

app.post('/createAccount', authenticateToken, async (req, res) => {

});
