import express from 'express';
import WebUserService from '../../services/webUserService.js';

const router = express.Router();

router.get('/patient/:uid', async (req, res) => {
  const patientUID = req.params.uid;

  try {
    const report = await WebUserService.generateReport(patientUID);
    if (!report) return res.status(404).json({ error: "Patient not found" });
    res.json(report);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
