import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { recommendationAPI, userAPI } from '../services/api'; // Assuming userAPI is available for fetching users
import './RecommendMovieModal.css'; // Will create this CSS file

const RecommendMovieModal = ({ movie, senderId, onClose }) => {
  const [recipientId, setRecipientId] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState(''); // 'idle', 'sending', 'success', 'error'
  const [users, setUsers] = useState([]); // To store a list of users for selection (optional, for future)

  // In a real app, you'd fetch a list of friends or all users to populate a dropdown/search
  // For now, we'll assume the user types in a recipient ID.
  // You might want to implement a user search here later.
  useEffect(() => {
    // Example: Fetch all users (if such an API exists and is appropriate)
    // userAPI.getAllUsers().then(setUsers).catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const recommendationData = {
        senderId: senderId,
        recipientId: recipientId,
        movieId: movie.id,
        message: message,
        movieTitle: movie.title,
        moviePoster: movie.poster,
        movieYear: movie.year,
      };
      await recommendationAPI.sendRecommendation(recommendationData);
      setStatus('success');
      setTimeout(onClose, 1500); // Close modal after a short delay
    } catch (err) {
      setStatus('error');
      console.error('Failed to send recommendation:', err);
    }
  };

  return (
    <motion.div
      className="recommend-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="recommend-modal-content"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="btn-close-x" onClick={onClose}>
          <X />
        </button>
        <h2>Recommend "{movie.title}"</h2>

        {status === 'success' && <p className="success-message">Recommendation sent successfully!</p>}
        {status === 'error' && <p className="error-message">Failed to send recommendation. Please try again.</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="recipientId">Recipient User ID:</label>
            <input
              type="text"
              id="recipientId"
              value={recipientId}
              onChange={(e) => setRecipientId(e.target.value)}
              placeholder="Enter recipient's user ID"
              required
              disabled={status === 'sending'}
            />
          </div>
          <div className="form-group">
            <label htmlFor="message">Your Message (optional):</label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g., 'You have to see this!'"
              rows="3"
              disabled={status === 'sending'}
            ></textarea>
          </div>
          <button type="submit" className="btn-send-recommendation" disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending...' : 'Send Recommendation'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default RecommendMovieModal;
