const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Get user search history
router.get('/:userId/search-history', async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.params.userId });
    if (!user) {
      return res.json({ searchHistory: [] });
    }
    
    const history = user.searchHistory
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 10)
      .map(item => item.query);
    
    res.json({ searchHistory: history });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add search to history
router.post('/:userId/search-history', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query?.trim()) {
      return res.status(400).json({ error: 'Query is required' });
    }

    let user = await User.findOne({ uid: req.params.userId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Remove existing query if present
    user.searchHistory = user.searchHistory.filter(item => item.query !== query.trim().toLowerCase());
    
    // Add new query at beginning
    user.searchHistory.unshift({
      query: query.trim().toLowerCase(),
      timestamp: new Date()
    });

    // Keep only last 10 searches
    user.searchHistory = user.searchHistory.slice(0, 10);

    await user.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Clear search history
router.delete('/:userId/search-history', async (req, res) => {
  try {
    await User.findOneAndUpdate(
      { uid: req.params.userId },
      { $set: { searchHistory: [] } }
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove specific search from history
router.delete('/:userId/search-history/:query', async (req, res) => {
  try {
    const query = decodeURIComponent(req.params.query);
    await User.findOneAndUpdate(
      { uid: req.params.userId },
      { $pull: { searchHistory: { query: query } } }
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user favorites
router.get('/:userId/favorites', async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.params.userId });
    if (!user) {
      return res.json({ favorites: [] });
    }
    
    const favorites = user.favorites
      .sort((a, b) => b.addedAt - a.addedAt)
      .map(fav => ({
        id: fav.movieId,
        title: fav.title,
        poster: fav.poster,
        rating: fav.rating,
        year: fav.year,
        description: fav.description,
        backdrop: fav.backdrop
      }));
    
    res.json({ favorites });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add movie to favorites
router.post('/:userId/favorites', async (req, res) => {
  try {
    const { id, title, poster, rating, year, description, backdrop } = req.body;
    if (!id || !title) {
      return res.status(400).json({ error: 'Movie ID and title are required' });
    }

    let user = await User.findOne({ uid: req.params.userId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if already in favorites
    const existingFav = user.favorites.find(fav => fav.movieId === id);
    if (existingFav) {
      return res.json({ success: true, message: 'Already in favorites' });
    }

    user.favorites.push({
      movieId: id,
      title,
      poster,
      rating,
      year,
      description,
      backdrop,
      addedAt: new Date()
    });

    await user.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove movie from favorites
router.delete('/:userId/favorites/:movieId', async (req, res) => {
  try {
    const movieId = parseInt(req.params.movieId);
    await User.findOneAndUpdate(
      { uid: req.params.userId },
      { $pull: { favorites: { movieId: movieId } } }
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;