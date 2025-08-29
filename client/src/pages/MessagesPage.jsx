import { useState, useEffect } from 'react';
import { notificationAPI, recommendationAPI, watchPartyAPI } from '../services/api'; // Import watchPartyAPI
import './MessagesPage.css';

const MessagesPage = ({ user }) => {
  const [activeTab, setActiveTab] = useState('notifications');
  const [notifications, setNotifications] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [watchParties, setWatchParties] = useState([]); // New state for watch parties
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Effect for Notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user?.uid || activeTab !== 'notifications') {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const fetchedNotifications = await notificationAPI.getNotifications(user.uid);
        setNotifications(fetchedNotifications);
      } catch (err) {
        setError('Failed to fetch notifications.');
        console.error('Error fetching notifications:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user, activeTab]);

  // Effect for Recommendations
  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!user?.uid || activeTab !== 'recommendations') {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const fetchedRecommendations = await recommendationAPI.getRecommendations(user.uid);
        setRecommendations(fetchedRecommendations);
      } catch (err) {
        setError('Failed to fetch recommendations.');
        console.error('Error fetching recommendations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [user, activeTab]);

  // Effect for Watch Parties
  useEffect(() => {
    const fetchWatchParties = async () => {
      if (!user?.uid || activeTab !== 'watch-parties') {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const fetchedWatchParties = await watchPartyAPI.getWatchParties(user.uid);
        setWatchParties(fetchedWatchParties);
      } catch (err) {
        setError('Failed to fetch watch parties.');
        console.error('Error fetching watch parties:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWatchParties();
  }, [user, activeTab]);

  const handleMarkNotificationAsRead = async (notificationId) => {
    try {
      await notificationAPI.markNotificationAsRead(notificationId);
      setNotifications(prevNotifications =>
        prevNotifications.map(notif =>
          notif._id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
    } catch (err) {
      console.error('Error marking notification as read:', err);
      setError('Failed to mark notification as read.');
    }
  };

  const handleMarkRecommendationAsRead = async (recommendationId) => {
    try {
      await recommendationAPI.markRecommendationAsRead(recommendationId);
      setRecommendations(prevRecommendations =>
        prevRecommendations.map(rec =>
          rec._id === recommendationId ? { ...rec, isRead: true } : rec
        )
      );
    } catch (err) {
      console.error('Error marking recommendation as read:', err);
      setError('Failed to mark recommendation as read.');
    }
  };

  const handleDeleteRecommendation = async (recommendationId) => {
    try {
      await recommendationAPI.deleteRecommendation(recommendationId);
      setRecommendations(prevRecommendations =>
        prevRecommendations.filter(rec => rec._id !== recommendationId)
      );
    } catch (err) {
      console.error('Error deleting recommendation:', err);
      setError('Failed to delete recommendation.');
    }
  };

  const handleRespondToWatchParty = async (partyId, status) => {
    try {
      await watchPartyAPI.respondToWatchParty(partyId, user.uid, status);
      setWatchParties(prevParties =>
        prevParties.map(party =>
          party._id === partyId
            ? {
                ...party,
                attendees: party.attendees.map(att =>
                  att.userId === user.uid ? { ...att, status: status } : att
                ),
              }
            : party
        )
      );
    } catch (err) {
      console.error('Error responding to watch party:', err);
      setError('Failed to respond to watch party.');
    }
  };

  const renderNotifications = () => {
    if (loading && activeTab === 'notifications') {
      return <p>Loading notifications...</p>;
    }
    if (error && activeTab === 'notifications') {
      return <p className="error-message">{error}</p>;
    }
    if (notifications.length === 0 && activeTab === 'notifications') {
      return <p>No notifications yet.</p>;
    }

    return (
      <div className="notifications-list">
        {notifications.map(notif => (
          <div key={notif._id} className={`notification-item ${notif.isRead ? 'read' : 'unread'}`}>
            <div className="notification-content">
              <p className="notification-message">{notif.message}</p>
              {notif.movieId && <p className="notification-movie-id">Movie ID: {notif.movieId}</p>}
              {notif.link && <a href={notif.link} className="notification-link">View Details</a>}
              <span className="notification-timestamp">{new Date(notif.createdAt).toLocaleString()}</span>
            </div>
            {!notif.isRead && (
              <button onClick={() => handleMarkNotificationAsRead(notif._id)} className="mark-read-button">
                Mark as Read
              </button>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderRecommendations = () => {
    if (loading && activeTab === 'recommendations') {
      return <p>Loading recommendations...</p>;
    }
    if (error && activeTab === 'recommendations') {
      return <p className="error-message">{error}</p>;
    }
    if (recommendations.length === 0 && activeTab === 'recommendations') {
      return <p>No recommendations yet.</p>;
    }

    return (
      <div className="recommendations-list">
        {recommendations.map(rec => (
          <div key={rec._id} className={`recommendation-item ${rec.isRead ? 'read' : 'unread'}`}>
            <div className="recommendation-content">
              <p className="recommendation-message">
                <span className="sender-id">{rec.senderId}</span> recommended:
                <strong> {rec.movieTitle} ({rec.movieYear})</strong>
              </p>
              {rec.message && <p className="recommendation-note">"{rec.message}"</p>}
              {rec.moviePoster && (
                <img src={`https://image.tmdb.org/t/p/w92${rec.moviePoster}`} alt={rec.movieTitle} className="recommendation-poster" />
              )}
              <span className="recommendation-timestamp">{new Date(rec.createdAt).toLocaleString()}</span>
            </div>
            <div className="recommendation-actions">
              {!rec.isRead && (
                <button onClick={() => handleMarkRecommendationAsRead(rec._id)} className="mark-read-button">
                  Mark as Read
                </button>
              )}
              <button onClick={() => handleDeleteRecommendation(rec._id)} className="delete-button">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderWatchParties = () => {
    if (loading && activeTab === 'watch-parties') {
      return <p>Loading watch parties...</p>;
    }
    if (error && activeTab === 'watch-parties') {
      return <p className="error-message">{error}</p>;
    }
    if (watchParties.length === 0 && activeTab === 'watch-parties') {
      return <p>No watch parties or invitations yet.</p>;
    }

    return (
      <div className="watch-parties-list">
        {watchParties.map(party => {
          const userAttendeeStatus = party.attendees.find(att => att.userId === user.uid)?.status;
          const isOrganizer = party.organizerId === user.uid;

          return (
            <div key={party._id} className={`watch-party-item ${userAttendeeStatus}`}>
              <div className="watch-party-content">
                <p className="watch-party-message">
                  {isOrganizer ? 'You are organizing:' : `${party.organizerId} invited you to:`}
                  <strong> {party.movieTitle}</strong>
                </p>
                <p className="watch-party-details">
                  Scheduled: {new Date(party.scheduledTime).toLocaleString()}
                </p>
                <p className="watch-party-details">Location: {party.location}</p>
                {party.moviePoster && (
                  <img src={`https://image.tmdb.org/t/p/w92${party.moviePoster}`} alt={party.movieTitle} className="watch-party-poster" />
                )}
                <span className="watch-party-timestamp">Created: {new Date(party.createdAt).toLocaleString()}</span>
              </div>
              <div className="watch-party-actions">
                {!isOrganizer && userAttendeeStatus === 'pending' && (
                  <>
                    <button onClick={() => handleRespondToWatchParty(party._id, 'accepted')} className="accept-button">
                      Accept
                    </button>
                    <button onClick={() => handleRespondToWatchParty(party._id, 'declined')} className="decline-button">
                      Decline
                    </button>
                  </>
                )}
                {isOrganizer && (
                  <button onClick={() => watchPartyAPI.deleteWatchParty(party._id, user.uid)} className="cancel-button">
                    Cancel Party
                  </button>
                )}
                {/* Display current status if not pending and not organizer */}
                {!isOrganizer && userAttendeeStatus !== 'pending' && (
                  <span className={`status-badge ${userAttendeeStatus}`}>{userAttendeeStatus}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'notifications':
        return <div className="tab-content">{renderNotifications()}</div>;
      case 'recommendations':
        return <div className="tab-content">{renderRecommendations()}</div>;
      case 'watch-parties':
        return <div className="tab-content">{renderWatchParties()}</div>;
      default:
        return null;
    }
  };

  return (
    <div className="messages-page">
      <div className="messages-header">
        <h2>Messages</h2>
      </div>
      <div className="messages-tabs">
        <button 
          className={`tab-button ${activeTab === 'notifications' ? 'active' : ''}`}
          onClick={() => setActiveTab('notifications')}
        >
          Notifications
        </button>
        <button 
          className={`tab-button ${activeTab === 'recommendations' ? 'active' : ''}`}
          onClick={() => setActiveTab('recommendations')}
        >
          Recommendations
        </button>
        <button 
          className={`tab-button ${activeTab === 'watch-parties' ? 'active' : ''}`}
          onClick={() => setActiveTab('watch-parties')}
        >
          Watch Parties
        </button>
      </div>
      <div className="messages-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default MessagesPage;