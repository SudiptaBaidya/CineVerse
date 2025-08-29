const mongoose = require('mongoose');

const watchPartySchema = new mongoose.Schema({
  organizerId: {
    type: String,
    required: true,
    ref: 'User'
  },
  movieId: {
    type: Number,
    required: true
  },
  movieTitle: {
    type: String,
    required: true
  },
  moviePoster: String,
  movieYear: Number,
  scheduledTime: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    enum: ['Virtual', 'Physical'], // Or more specific options
    default: 'Virtual'
  },
  invitedUsers: [{
    type: String, // User IDs
    ref: 'User'
  }],
  attendees: [{
    userId: {
      type: String,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined'],
      default: 'pending'
    }
  }],
  status: {
    type: String,
    enum: ['scheduled', 'active', 'completed', 'cancelled'],
    default: 'scheduled'
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('WatchParty', watchPartySchema);
