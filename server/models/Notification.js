const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipientId: {
    type: String, // Corresponds to user.uid from Firebase/User model
    required: true,
    index: true // Index for faster lookup by recipient
  },
  senderId: {
    type: String, // Optional: if the notification is from another user (e.g., recommendation)
    ref: 'User' // Reference to the User model
  },
  type: {
    type: String,
    required: true,
    enum: ['recommendation', 'watchlist_update', 'watch_party_invite', 'system_message', 'favorite_activity']
  },
  message: {
    type: String,
    required: true
  },
  movieId: {
    type: Number, // Optional: if the notification is related to a specific movie
  },
  isRead: {
    type: Boolean,
    default: false
  },
  // You can add more fields as needed, e.g., link to a specific page
  link: String,
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Notification', notificationSchema);
