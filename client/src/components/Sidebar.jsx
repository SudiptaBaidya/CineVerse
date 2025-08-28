import { Home, Film, MessageCircle, Heart, Download, Settings } from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ onViewChange, currentView }) => {
  const navItems = [
    { name: 'Home', icon: Home, view: 'home' },
    { name: 'Movies', icon: Film, view: 'movies' },
    { name: 'Messages', icon: MessageCircle, view: 'messages' },
    { name: 'Favorites', icon: Heart, view: 'favorites' },
    { name: 'Downloads', icon: Download, view: 'downloads' },
    { name: 'Settings', icon: Settings, view: 'settings' },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="sidebar-desktop">
        <div className="sidebar-container">
          <div className="sidebar-header">
            <h1 className="sidebar-logo">CineVerse</h1>
          </div>
          <div className="sidebar-nav">
            <nav className="nav-list">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.name}
                    onClick={() => onViewChange && onViewChange(item.view)}
                    className={`nav-item ${currentView === item.view ? 'nav-item-active' : ''}`}
                  >
                    <Icon className="nav-icon" />
                    {item.name}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="sidebar-mobile">
        <div className="mobile-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                onClick={() => onViewChange && onViewChange(item.view)}
                className="mobile-nav-item"
              >
                <Icon className={`mobile-nav-icon ${currentView === item.view ? 'mobile-nav-icon-active' : ''}`} />
                <span className="mobile-nav-text">{item.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Sidebar;