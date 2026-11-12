const express = require('express');
const router = express.Router();
const monopolyService = require('../services/monopolyService');

router.post('/reserve', (req, res) => {
  try {
    const {
      userId,
      talukId,
      chapterId,
      categoryId,
      businessName,
      ownerName,
      phone,
      email,
      address,
      gstNumber,
      tagline,
      description
    } = req.body;

    if (!talukId || !categoryId || !businessName || !ownerName || !phone) {
      return res.status(400).json({ error: 'அனைத்து முக்கிய விவரங்களையும் நிரப்பவும் (Missing required fields)' });
    }

    const result = monopolyService.reserveCategorySeat({
      userId,
      talukId,
      chapterId,
      categoryId,
      businessName,
      ownerName,
      phone,
      email,
      address,
      gstNumber,
      tagline,
      description
    });

    res.json(result);
  } catch (err) {
    const status = err.statusCode || 500;
    res.status(status).json({
      error: err.message,
      occupiedBy: err.occupiedBy || null
    });
  }
});

module.exports = router;
