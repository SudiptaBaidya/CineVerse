const SEARCH_HISTORY_KEY = 'cineverse_search_history';

import { userAPI } from '../services/api';

export const searchHistory = {
  getHistory: async (userId) => {
    if (!userId) return [];
    return await userAPI.getSearchHistory(userId);
  },

  addToHistory: async (userId, query) => {
    if (!userId || !query?.trim()) return;
    return await userAPI.addSearchHistory(userId, query.trim());
  },

  clearHistory: async (userId) => {
    if (!userId) return;
    return await userAPI.clearSearchHistory(userId);
  },

  removeFromHistory: async (userId, query) => {
    if (!userId || !query) return;
    return await userAPI.removeSearchHistory(userId, query);
  }
};