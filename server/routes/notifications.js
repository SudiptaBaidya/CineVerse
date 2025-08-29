const express = require('express');
const Notification = require('../models/Notification');
const router = express.Router();

// Middleware to get user ID from request (assuming it's passed in headers or body for now)
// In a real app, you'd use authentication middleware to get the user ID from the token.
// For now, we'll assume recipientId is passed in the request body or params for simplicity.

// Get all notifications for a user
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await Notification.find({ recipientId: userId })
                                            .sort({ createdAt: -1 }); // Newest first
    res.json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark a notification as read
router.post('/:notificationId/read', async (req, res) => {
  try {
    const { notificationId } = req.params;
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true } // Return the updated document
    );

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json({ success: true, notification });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// (Optional) Endpoint to create a notification - for internal server use or admin
// This would typically be called by other parts of the backend, not directly by the client.
// For example, when a movie is added to a user's watchlist, the server could create a 'watchlist_update' notification.
router.post('/', async (req, res) => {
  try {
    const { recipientId, senderId, type, message, movieId, link } = req.body;
    const newNotification = new Notification({
      recipientId,
      senderId,
      type,
      message,
      movieId,
      link
    });
    await newNotification.save();
    res.status(201).json({ success: true, notification: newNotification });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
