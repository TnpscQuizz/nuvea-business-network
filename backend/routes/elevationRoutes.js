const express = require('express');
const router = express.Router();
const { getLeaderboard } = require('../services/elevationService');
const db = require('../database/db');

router.get('/leaderboard', (req, res) => {
  const { talukId } = req.query;
  const list = getLeaderboard(talukId);
  const settings = db.getSettings();

  res.json({
    settings: {
      elevationWeights: settings.elevationWeights,
      elevationMinLeads: settings.elevationMinLeads,
      elevationMinAttendance: settings.elevationMinAttendance
    },
    totalRanked: list.length,
    leaderboard: list
  });
});

module.exports = router;
