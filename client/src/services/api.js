const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://cineverse-sqqj.onrender.com/api';

export const userAPI = {
  // Get user search history
  getSearchHistory: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/search-history`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      return data.searchHistory || [];
    } catch (error) {
      console.error('Error fetching search history:', error);
      return [];
    }
  },

  // Add search to history
  addSearchHistory: async (userId, query) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/search-history`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error adding search history:', error);
      return null;
    }
  },

  // Clear search history
  clearSearchHistory: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/search-history`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error clearing search history:', error);
      return null;
    }
  },

  // Remove specific search from history
  removeSearchHistory: async (userId, query) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/search-history/${encodeURIComponent(query)}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error removing search history:', error);
      return null;
    }
  },

  // Get user favorites
  getFavorites: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/favorites`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      return data.favorites || [];
    } catch (error) {
      console.error('Error fetching favorites:', error);
      return [];
    }
  },

  // Add movie to favorites
  addFavorite: async (userId, movie) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/favorites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(movie)
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error adding favorite:', error);
      return null;
    }
  },

  // Remove movie from favorites
  removeFavorite: async (userId, movieId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/favorites/${movieId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error removing favorite:', error);
      return null;
    }
  }
};

export const notificationAPI = {
  getNotifications: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/${userId}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      return data.notifications || [];
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  },

  markNotificationAsRead: async (notificationId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return null;
    }
  },
};

export const recommendationAPI = {
  sendRecommendation: async (recommendationData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/recommendations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recommendationData)
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error sending recommendation:', error);
      return null;
    }
  },

  getRecommendations: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/recommendations/${userId}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      return data.recommendations || [];
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      return [];
    }
  },

  markRecommendationAsRead: async (recommendationId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/recommendations/${recommendationId}/read`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error marking recommendation as read:', error);
      return null;
    }
  },

  deleteRecommendation: async (recommendationId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/recommendations/${recommendationId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error deleting recommendation:', error);
      return null;
    }
  },
};

export const watchPartyAPI = {
  createWatchParty: async (partyData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/watchparties`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(partyData)
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error creating watch party:', error);
      return null;
    }
  },

  getWatchParties: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/watchparties/${userId}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      return data.watchParties || [];
    } catch (error) {
      console.error('Error fetching watch parties:', error);
      return [];
    }
  },

  respondToWatchParty: async (partyId, userId, status) => {
    try {
      const response = await fetch(`${API_BASE_URL}/watchparties/${partyId}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, status })
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error responding to watch party:', error);
      return null;
    }
  },

  getWatchPartyDetails: async (partyId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/watchparties/details/${partyId}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching watch party details:', error);
      return null;
    }
  },

  deleteWatchParty: async (partyId, organizerId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/watchparties/${partyId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ organizerId })
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error deleting watch party:', error);
      return null;
    }
  },
};