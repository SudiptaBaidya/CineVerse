import { Home, Film, MessageCircle, Heart, Download, Settings } from 'lucide-react';

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
      {/* Desktop Sidebar - Hidden on mobile */}
      <div className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-64 z-50">
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto" style={{backgroundColor: '#1B1D2A'}}>
          <div className="flex items-center flex-shrink-0 px-4">
            <h1 className="text-2xl font-bold" style={{background: 'linear-gradient(to right, #E50914, #ef4444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
              CineVerse
            </h1>
          </div>
          <div className="mt-8 flex-grow flex flex-col">
            <nav className="flex-1 px-2 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href="#"
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                      item.active 
                        ? 'text-white' 
                        : 'text-gray-300 hover:text-white hover:bg-gray-700'
                    }`}
                    style={item.active ? {backgroundColor: '#E50914'} : {}}
                  >
                    <Icon className="mr-3 h-6 w-6" />
                    {item.name}
                  </a>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation - Hidden on desktop */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50" style={{backgroundColor: '#1B1D2A', borderTop: '1px solid #374151'}}>
        <div className="grid grid-cols-6 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.name}
                href="#"
                className="flex flex-col items-center justify-center py-2 px-1 transition-colors text-gray-400 hover:text-white"
              >
                <Icon 
                  className="h-5 w-5 mb-1" 
                  style={item.active ? {color: '#E50914'} : {}}
                />
                <span className="text-xs">{item.name}</span>
              </a>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Sidebar;