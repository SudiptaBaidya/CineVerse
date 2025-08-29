import React, { useContext } from 'react';
import './Settings.css';
import { ThemeContext } from '../contexts/ThemeContext';
import { SettingsContext } from '../contexts/SettingsContext';
import { searchHistory } from '../utils/searchHistory';

const Settings = ({ user, onClose }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { includeAdult, toggleAdultContent } = useContext(SettingsContext);

  const handleClearHistory = () => {
    if (user?.uid) {
      searchHistory.clearHistory(user.uid);
      alert('Search history cleared!');
    }
  };

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-panel" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <h2>Settings</h2>
          <button onClick={onClose} className="close-button">&times;</button>
        </div>
        <div className="settings-content">
          <div className="setting-item">
            <div className="setting-text">
              <h3>Dark Mode</h3>
              <p>Toggle between light and dark themes.</p>
            </div>
            <div className="setting-control">
              <label className="switch">
                <input 
                  type="checkbox" 
                  onChange={toggleTheme} 
                  checked={theme === 'dark'}
                />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
          <div className="setting-item">
            <div className="setting-text">
              <h3>Include Adult Content</h3>
              <p>Show or hide movies and shows intended for mature audiences.</p>
            </div>
            <div className="setting-control">
              <label className="switch">
                <input 
                  type="checkbox" 
                  onChange={toggleAdultContent} 
                  checked={includeAdult}
                />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
          <div className="setting-item">
            <div className="setting-text">
              <h3>Clear Search History</h3>
              <p>Deletes all your past search entries.</p>
            </div>
            <div className="setting-control">
              <button onClick={handleClearHistory} className="button-danger">
                Clear History
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
