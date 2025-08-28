import { signInWithPopup, signOut } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, googleProvider } from './firebase';
import Sidebar from './components/Sidebar';

function App() {
  const [user] = useAuthState(auth);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Error signing in:', error);
      alert('Sign in failed. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cineverse-bg">
        <div className="cineverse-card p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gradient mb-2">CineVerse</h1>
            <p className="text-gray-300">Your gateway to unlimited entertainment</p>
          </div>
          <button
            onClick={signInWithGoogle}
            className="cineverse-button w-full py-4 text-lg flex items-center justify-center space-x-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cineverse-bg text-white">
      <Sidebar />
      
      {/* Top Navigation */}
      <nav className="md:ml-64 bg-cineverse-card/90 backdrop-blur-sm p-4 sticky top-0 z-40">
        <div className="flex justify-between items-center">
          <h1 className="md:hidden text-2xl font-bold text-gradient">CineVerse</h1>
          <div className="flex items-center space-x-4 ml-auto">
            <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full" />
            <button
              onClick={handleLogout}
              className="cineverse-button"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="md:ml-64 p-8 pb-20 md:pb-8">
        <h2 className="text-4xl font-bold mb-6 text-gradient">Welcome to CineVerse</h2>
        <p className="text-gray-300 text-lg mb-8">Your movie streaming platform is ready!</p>
        
        {/* Sample Content Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[1,2,3,4,5,6,7,8,9,10,11,12].map(i => (
            <div key={i} className="cineverse-card overflow-hidden hover:scale-105 transition cursor-pointer">
              <div className="aspect-[2/3] bg-gradient-to-br from-cineverse-accent to-purple-600 flex items-center justify-center">
                <span className="text-2xl font-bold">M{i}</span>
              </div>
              <div className="p-3">
                <h3 className="font-semibold truncate">Movie {i}</h3>
                <p className="text-sm text-gray-400">2024</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;