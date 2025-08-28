import { useState } from 'react';
import { signInWithPopup, signOut } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, googleProvider } from './firebase';
import Sidebar from './components/Sidebar';
import TopNav from './components/TopNav';
import HeroBanner from './components/HeroBanner';
import MovieSection from './components/MovieSection';
import MovieDetails from './components/MovieDetails';
import './App.css';

function App() {
  const [user] = useAuthState(auth);
  const [selectedMovieId, setSelectedMovieId] = useState(null);

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

  const handleMovieClick = (movieId) => {
    console.log('App: Movie clicked:', movieId); // Debug log
    setSelectedMovieId(movieId);
  };

  const handleCloseMovieDetails = () => {
    console.log('App: Closing movie details'); // Debug log
    setSelectedMovieId(null);
  };

  if (!user) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1 className="login-title">CineVerse</h1>
            <p className="login-subtitle">Your gateway to unlimited entertainment</p>
          </div>
          <button onClick={signInWithGoogle} className="login-button">
            <svg className="google-icon" viewBox="0 0 24 24">
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
    <div className="app">
      <Sidebar />
      <TopNav user={user} onLogout={handleLogout} />

      {/* Main Content */}
      <div className="main-content">
        <HeroBanner onMovieClick={handleMovieClick} />
        
        <MovieSection title="You Might Like" type="recommendations" onMovieClick={handleMovieClick} />
        <MovieSection title="Trending Now" type="trending" onMovieClick={handleMovieClick} />
        <MovieSection title="Popular Movies" type="popular" onMovieClick={handleMovieClick} />
      </div>

      {/* Movie Details Modal */}
      {selectedMovieId && (
        <MovieDetails 
          movieId={selectedMovieId} 
          onClose={handleCloseMovieDetails} 
        />
      )}

      {/* Debug Info */}
      {selectedMovieId && (
        <div style={{
          position: 'fixed',
          top: '10px',
          left: '10px',
          background: 'red',
          color: 'white',
          padding: '10px',
          zIndex: 9999
        }}>
          Selected Movie ID: {selectedMovieId}
        </div>
      )}
    </div>
  );
}

export default App;