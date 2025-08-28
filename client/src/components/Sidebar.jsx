import { Home, Film, MessageCircle, Heart, Download, Settings } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const navItems = [
    { name: 'Home', icon: Home, active: true },
    { name: 'Movies', icon: Film },
    { name: 'Messages', icon: MessageCircle },
    { name: 'Favorites', icon: Heart },
    { name: 'Downloads', icon: Download },
    { name: 'Settings', icon: Settings },
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
                  <a
                    key={item.name}
                    href="#"
                    className={`nav-item ${item.active ? 'nav-item-active' : ''}`}
                  >
                    <Icon className="nav-icon" />
                    {item.name}
                  </a>
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
              <a
                key={item.name}
                href="#"
                className="mobile-nav-item"
              >
                <Icon className={`mobile-nav-icon ${item.active ? 'mobile-nav-icon-active' : ''}`} />
                <span className="mobile-nav-text">{item.name}</span>
              </a>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Sidebar;