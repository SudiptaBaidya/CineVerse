const express = require('express');
const Recommendation = require('../models/Recommendation');
const router = express.Router();

// Send a new movie recommendation
router.post('/', async (req, res) => {
  try {
    const { senderId, recipientId, movieId, message, movieTitle, moviePoster, movieYear } = req.body;

    if (!senderId || !recipientId || !movieId) {
      return res.status(400).json({ error: 'Sender ID, Recipient ID, and Movie ID are required.' });
    }

    const newRecommendation = new Recommendation({
      senderId,
      recipientId,
      movieId,
      message,
      movieTitle,
      moviePoster,
      movieYear,
    });
    await newRecommendation.save();
    res.status(201).json({ success: true, recommendation: newRecommendation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all recommendations received by a user
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const recommendations = await Recommendation.find({ recipientId: userId })
                                                .sort({ createdAt: -1 }); // Newest first
    res.json({ success: true, recommendations });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark a recommendation as read
router.post('/:recommendationId/read', async (req, res) => {
  try {
    const { recommendationId } = req.params;
    const recommendation = await Recommendation.findByIdAndUpdate(
      recommendationId,
      { isRead: true },
      { new: true } // Return the updated document
    );

    if (!recommendation) {
      return res.status(404).json({ error: 'Recommendation not found' });
    }

    res.json({ success: true, recommendation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a recommendation
router.delete('/:recommendationId', async (req, res) => {
  try {
    const { recommendationId } = req.params;
    const result = await Recommendation.findByIdAndDelete(recommendationId);

    if (!result) {
      return res.status(404).json({ error: 'Recommendation not found' });
    }

    res.json({ success: true, message: 'Recommendation deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
