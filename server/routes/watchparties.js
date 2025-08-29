const express = require('express');
const WatchParty = require('../models/WatchParty');
const router = express.Router();

// Create a new watch party
router.post('/', async (req, res) => {
  try {
    const { organizerId, movieId, movieTitle, moviePoster, movieYear, scheduledTime, location, invitedUsers } = req.body;

    if (!organizerId || !movieId || !movieTitle || !scheduledTime) {
      return res.status(400).json({ error: 'Organizer ID, Movie ID, Movie Title, and Scheduled Time are required.' });
    }

    // Initialize attendees with organizer and invited users (all pending initially)
    const attendees = [{ userId: organizerId, status: 'accepted' }]; // Organizer is automatically accepted
    if (invitedUsers && invitedUsers.length > 0) {
      invitedUsers.forEach(userId => {
        if (userId !== organizerId) { // Avoid duplicating organizer
          attendees.push({ userId, status: 'pending' });
        }
      });
    }

    const newWatchParty = new WatchParty({
      organizerId,
      movieId,
      movieTitle,
      moviePoster,
      movieYear,
      scheduledTime,
      location,
      invitedUsers: invitedUsers || [], // Store invited users separately for easy lookup
      attendees,
    });
    await newWatchParty.save();
    res.status(201).json({ success: true, watchParty: newWatchParty });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all watch parties a user is involved in (organized or invited to)
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const watchParties = await WatchParty.find({
      $or: [
        { organizerId: userId },
        { 'attendees.userId': userId }
      ]
    }).sort({ scheduledTime: -1 }); // Upcoming first
    res.json({ success: true, watchParties });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get details of a specific watch party
router.get('/details/:partyId', async (req, res) => {
  try {
    const { partyId } = req.params;
    const watchParty = await WatchParty.findById(partyId);

    if (!watchParty) {
      return res.status(404).json({ error: 'Watch party not found' });
    }
    res.json({ success: true, watchParty });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Respond to an invitation (accept/decline)
router.post('/:partyId/respond', async (req, res) => {
  try {
    const { partyId } = req.params;
    const { userId, status } = req.body; // status: 'accepted' or 'declined'

    if (!userId || !status || !['accepted', 'declined'].includes(status)) {
      return res.status(400).json({ error: 'User ID and valid status (accepted/declined) are required.' });
    }

    const watchParty = await WatchParty.findOneAndUpdate(
      { _id: partyId, 'attendees.userId': userId },
      { $set: { 'attendees.$.status': status } },
      { new: true }
    );

    if (!watchParty) {
      return res.status(404).json({ error: 'Watch party or attendee not found' });
    }

    res.json({ success: true, watchParty });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Cancel/Delete a watch party (organizer only)
router.delete('/:partyId', async (req, res) => {
  try {
    const { partyId } = req.params;
    const { organizerId } = req.body; // Ensure only organizer can delete

    const result = await WatchParty.findOneAndDelete({ _id: partyId, organizerId: organizerId });

    if (!result) {
      return res.status(404).json({ error: 'Watch party not found or you are not the organizer.' });
    }

    res.json({ success: true, message: 'Watch party cancelled successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
