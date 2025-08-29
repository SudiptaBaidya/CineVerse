const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
  senderId: {
    type: String,
    required: true,
    ref: 'User' // Reference to the User model
  },
  recipientId: {
    type: String,
    required: true,
    ref: 'User', // Reference to the User model
    index: true // Index for faster lookup by recipient
  },
  movieId: {
    type: Number,
    required: true
  },
  message: {
    type: String,
    default: ''
  },
  isRead: {
    type: Boolean,
    default: false
  },
  // We might want to store some movie details directly to avoid extra TMDB calls
  movieTitle: String,
  moviePoster: String,
  movieYear: Number,
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Recommendation', recommendationSchema);
