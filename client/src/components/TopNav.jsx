import { Search } from 'lucide-react';
import { useState } from 'react';

const TopNav = ({ user, onLogout }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  return (
    <nav className="lg:ml-64 backdrop-blur-sm p-4 sticky top-0 z-40" style={{backgroundColor: 'rgba(27, 29, 42, 0.9)'}}>
      <div className="flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center">
          <h1 className="text-xl lg:text-2xl font-bold text-white">
            CineVerse
          </h1>
        </div>

        {/* Center: Search Bar (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-lg mx-8">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search movies, shows..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all"
              style={{
                backgroundColor: '#1B1D2A',
                border: '1px solid #374151',
                focusRingColor: '#E50914'
              }}
              onFocus={(e) => e.target.style.borderColor = '#E50914'}
              onBlur={(e) => e.target.style.borderColor = '#374151'}
            />
          </div>
        </div>

        {/* Right: User Avatar + Mobile Search */}
        <div className="flex items-center space-x-3">
          {/* Mobile Search Icon */}
          <button
            className="md:hidden p-2 rounded-full hover:bg-gray-700 transition-colors"
            onClick={() => setShowMobileSearch(!showMobileSearch)}
          >
            <Search className="h-5 w-5 text-gray-300" />
          </button>

          {/* User Avatar */}
          <div className="relative">
            <img 
              src={user?.photoURL} 
              alt="Profile" 
              className="w-8 h-8 lg:w-10 lg:h-10 rounded-full border-2 border-gray-600 hover:border-red-500 transition-colors cursor-pointer"
            />
          </div>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="hidden lg:block px-4 py-2 rounded font-semibold transition-all duration-200 text-sm"
            style={{backgroundColor: '#E50914'}}
            onMouseOver={(e) => e.target.style.backgroundColor = '#b8070f'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#E50914'}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Mobile Search Bar (Expandable) */}
      {showMobileSearch && (
        <div className="md:hidden mt-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search movies, shows..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all"
              style={{
                backgroundColor: '#1B1D2A',
                border: '1px solid #374151'
              }}
              onFocus={(e) => e.target.style.borderColor = '#E50914'}
              onBlur={(e) => e.target.style.borderColor = '#374151'}
              autoFocus
            />
          </div>
        </div>
      )}
    </nav>
  );
};

export default TopNav;