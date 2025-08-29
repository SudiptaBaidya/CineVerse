import { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { watchPartyAPI } from '../services/api';
import './CreateWatchPartyModal.css'; // Will create this CSS file

const CreateWatchPartyModal = ({ movie, organizerId, onClose }) => {
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [location, setLocation] = useState('Virtual');
  const [invitedUserIds, setInvitedUserIds] = useState(''); // Comma-separated user IDs
  const [status, setStatus] = useState(''); // 'idle', 'sending', 'success', 'error'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    const fullScheduledTime = new Date(`${scheduledDate}T${scheduledTime}`);
    const invitedUsersArray = invitedUserIds.split(',').map(id => id.trim()).filter(id => id);

    try {
      const partyData = {
        organizerId: organizerId,
        movieId: movie.id,
        movieTitle: movie.title,
        moviePoster: movie.poster,
        movieYear: movie.year,
        scheduledTime: fullScheduledTime.toISOString(),
        location: location,
        invitedUsers: invitedUsersArray,
      };
      await watchPartyAPI.createWatchParty(partyData);
      setStatus('success');
      setTimeout(onClose, 1500); // Close modal after a short delay
    } catch (err) {
      setStatus('error');
      console.error('Failed to create watch party:', err);
    }
  };

  return (
    <motion.div
      className="create-party-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="create-party-modal-content"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="btn-close-x" onClick={onClose}>
          <X />
        </button>
        <h2>Organize Watch Party for "{movie.title}"</h2>

        {status === 'success' && <p className="success-message">Watch Party created successfully!</p>}
        {status === 'error' && <p className="error-message">Failed to create watch party. Please try again.</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="scheduledDate">Date:</label>
            <input
              type="date"
              id="scheduledDate"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              required
              disabled={status === 'sending'}
            />
          </div>
          <div className="form-group">
            <label htmlFor="scheduledTime">Time:</label>
            <input
              type="time"
              id="scheduledTime"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              required
              disabled={status === 'sending'}
            />
          </div>
          <div className="form-group">
            <label htmlFor="location">Location:</label>
            <select
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              disabled={status === 'sending'}
            >
              <option value="Virtual">Virtual</option>
              <option value="Physical">Physical</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="invitedUserIds">Invite User IDs (comma-separated):</label>
            <textarea
              id="invitedUserIds"
              value={invitedUserIds}
              onChange={(e) => setInvitedUserIds(e.target.value)}
              placeholder="user123, user456, user789"
              rows="2"
              disabled={status === 'sending'}
            ></textarea>
          </div>
          <button type="submit" className="btn-create-party-submit" disabled={status === 'sending'}>
            {status === 'sending' ? 'Creating...' : 'Create Party'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default CreateWatchPartyModal;
