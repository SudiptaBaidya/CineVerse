const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://cineverse-backend-xyz.onrender.com/api';

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