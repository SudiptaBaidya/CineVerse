import { Home, Film, MessageCircle, Heart, Download, Settings } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ navigate, onOpenSettings }) => {
  const location = useLocation();

  const navItems = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'Movies', icon: Film, path: '/movies' },
    { name: 'Messages', icon: MessageCircle, path: '/messages' },
    { name: 'Favorites', icon: Heart, path: '/favorites' },
    { name: 'Downloads', icon: Download, path: '/downloads' },
    { name: 'Settings', icon: Settings, handler: onOpenSettings },
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
                const isActive = item.path && location.pathname === item.path;
                return (
                  <div
                    key={item.name}
                    onClick={() => { item.handler ? item.handler() : navigate(item.path); }}
                    className={`nav-item ${isActive ? 'nav-item-active' : ''}`}
                    role="button"
                  >
                    <Icon className="nav-icon" />
                    {item.name}
                  </div>
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
            const isActive = item.path && location.pathname === item.path;
            return (
              <div
                key={item.name}
                onClick={() => { item.handler ? item.handler() : navigate(item.path); }}
                className="mobile-nav-item"
                role="button"
              >
                <Icon className={`mobile-nav-icon ${isActive ? 'mobile-nav-icon-active' : ''}`} />
                <span className="mobile-nav-text">{item.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Sidebar;