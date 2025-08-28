import { Search } from 'lucide-react';
import { useState } from 'react';
import './TopNav.css';

const TopNav = ({ user, onLogout }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  return (
    <nav className="topnav">
      <div className="topnav-container">
        {/* Left: Logo */}
        <div className="topnav-logo">
          <h1>CineVerse</h1>
        </div>

        {/* Center: Search Bar (Desktop) */}
        <div className="topnav-search-desktop">
          <div className="search-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search movies, shows..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
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
            <img src={user?.photoURL} alt="Profile" />
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
          <div className="search-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search movies, shows..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
              autoFocus
            />
          </div>
        </div>
      )}
    </nav>
  );
};

export default TopNav;