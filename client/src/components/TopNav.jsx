import { Search, X, Clock } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { searchHistory } from '../utils/searchHistory';
import { tmdbAPI } from '../services/tmdb';
import './TopNav.css';

const TopNav = ({ user, onLogout, onSearch, onMovieSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [history, setHistory] = useState([]);
  const searchRef = useRef(null);

  useEffect(() => {
    const loadHistory = async () => {
      if (user?.uid) {
        const userHistory = await searchHistory.getHistory(user.uid);
        setHistory(userHistory);
      }
    };
    loadHistory();
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (value.trim().length > 0) {
      setShowSuggestions(true);
      try {
        const results = await tmdbAPI.searchMovies(value.trim());
        setSuggestions(results.slice(0, 5));
      } catch (error) {
        setSuggestions([]);
      }
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
    }
  };

  const handleSearch = async (query) => {
    const searchTerm = query || searchQuery.trim();
    if (searchTerm && onSearch) {
      if (user?.uid) {
        await searchHistory.addToHistory(user.uid, searchTerm);
        const updatedHistory = await searchHistory.getHistory(user.uid);
        setHistory(updatedHistory);
      }
      onSearch(searchTerm);
      setShowSuggestions(false);
      setSearchQuery('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  const clearHistory = async () => {
    if (user?.uid) {
      await searchHistory.clearHistory(user.uid);
      setHistory([]);
    }
  };

  const removeHistoryItem = async (item) => {
    if (user?.uid) {
      await searchHistory.removeFromHistory(user.uid, item);
      const updatedHistory = await searchHistory.getHistory(user.uid);
      setHistory(updatedHistory);
    }
  };

  return (
    <nav className="topnav">
      <div className="topnav-container">
        {/* Left: Logo */}
        <div className="topnav-logo">
          <h1>CineVerse</h1>
        </div>

        {/* Center: Search Bar (Desktop) */}
        <div className="topnav-search-desktop" ref={searchRef}>
          <form className="search-container" onSubmit={handleSubmit}>
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search movies, shows..."
              value={searchQuery}
              onChange={handleInputChange}
              onFocus={() => setShowSuggestions(true)}
              className="search-input"
            />
          </form>
          
          {showSuggestions && (
            <div className="search-suggestions">
              {searchQuery.trim() === '' && history.length > 0 && (
                <div className="suggestions-section">
                  <div className="suggestions-header">
                    <span>Recent Searches</span>
                    <button onClick={clearHistory} className="clear-history">Clear All</button>
                  </div>
                  {history.map((item, index) => (
                    <div key={index} className="suggestion-item history-item" onClick={() => handleSearch(item)}>
                      <Clock className="suggestion-icon" />
                      <span>{item}</span>
                      <button onClick={(e) => { e.stopPropagation(); removeHistoryItem(item); }} className="remove-item">
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {suggestions.length > 0 && (
                <div className="suggestions-section">
                  <div className="suggestions-header">
                    <span>Suggestions</span>
                  </div>
                  {suggestions.map((movie) => (
                    <div key={movie.id} className="suggestion-item movie-suggestion" onClick={() => onMovieSelect(movie.id)}>
                      <img src={movie.poster} alt={movie.title} className="suggestion-poster" />
                      <div className="suggestion-info">
                        <span className="suggestion-title">{movie.title}</span>
                        <span className="suggestion-year">{movie.year}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: User Avatar + Mobile Search */}
        <div className="topnav-right">
          {/* Mobile Search Icon */}
          <button
            className="mobile-search-btn"
            onClick={() => setShowMobileSearch(!showMobileSearch)}
          >
            <Search className="search-icon-mobile" />
          </button>

          {/* User Avatar */}
          <div className="user-avatar">
            <img 
              src={user?.photoURL} 
              alt="Profile" 
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>

          {/* Logout Button */}
          <button onClick={onLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>

      {/* Mobile Search Bar (Expandable) */}
      {showMobileSearch && (
        <div className="mobile-search">
          <form className="search-container" onSubmit={handleSubmit}>
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search movies, shows..."
              value={searchQuery}
              onChange={handleInputChange}
              className="search-input"
              autoFocus
            />
          </form>
        </div>
      )}
    </nav>
  );
};

export default TopNav;