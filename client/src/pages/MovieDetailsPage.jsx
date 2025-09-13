import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Download, Star, Clock, MessageSquarePlus, CalendarPlus, Heart } from 'lucide-react';
import RecommendMovieModal from '../components/RecommendMovieModal';
import CreateWatchPartyModal from '../components/CreateWatchPartyModal';
import { tmdbAPI } from '../services/tmdb';
import { userAPI } from '../services/api'; // Import userAPI
import './MovieDetailsPage.css';

const MovieDetailsPage = ({ user, onMovieClick }) => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [watchProviders, setWatchProviders] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRecommendModal, setShowRecommendModal] = useState(false);
  const [showCreateWatchPartyModal, setShowCreateWatchPartyModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false); // New state for favorite status

  useEffect(() => {
    const fetchMovieDetails = async () => {
      setLoading(true);
      try {
        const movieData = await tmdbAPI.getMovieDetails(movieId);
        setMovie(movieData);
        const providersData = await tmdbAPI.getWatchProviders(movieId);
        setWatchProviders(providersData);
      } catch (error) {
        console.error('Error fetching movie details:', error);
        setMovie(null); // Set movie to null on error
      } finally {
        setLoading(false);
      }
    };

    if (movieId) {
      fetchMovieDetails();
    }
  }, [movieId]);

  // Effect to check if movie is a favorite
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (user?.uid && movie) {
        try {
          const favorites = await userAPI.getFavorites(user.uid);
          const isFav = favorites.some(fav => fav.id === movie.id); // Assuming movie object has an 'id'
          setIsFavorite(isFav);
        } catch (error) {
          console.error('Error checking favorite status:', error);
        }
      }
    };
    checkFavoriteStatus();
  }, [user, movie]); // Re-run when user or movie changes

  const formatRuntime = (minutes) => {
    if (!minutes) return '';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const openTrailer = () => {
    if (movie?.trailer) {
      window.open(`https://www.youtube.com/watch?v=${movie.trailer}`, '_blank');
    }
  };

  const handleFavoriteToggle = async () => {
    if (!user?.uid || !movie) {
      console.warn('User not logged in or movie data not available.');
      alert('Please log in to add movies to your favorites!'); // Provide user feedback
      return;
    }

    try {
      if (isFavorite) {
        await userAPI.removeFavorite(user.uid, movie.id);
        setIsFavorite(false);
        alert(`${movie.title} removed from favorites!`); // User feedback
      } else {
        // Ensure the movie object passed to addFavorite has necessary details
        const movieToAdd = {
          id: movie.id,
          title: movie.title,
          poster: movie.poster,
          year: movie.year,
          // Add any other relevant movie details you want to store
        };
        await userAPI.addFavorite(user.uid, movieToAdd);
        setIsFavorite(true);
        alert(`${movie.title} added to favorites!`); // User feedback
      }
    } catch (error) {
      console.error('Error toggling favorite status:', error);
      alert('Failed to update favorites. Please try again.'); // User feedback
    }
  };

  if (loading) {
    return (
      <div className="movie-details-page-loading">
        <div className="loading-spinner"></div>
        <p>Loading movie details...</p>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="movie-details-page-error">
        <p>Movie not found or an error occurred.</p>
        <button onClick={() => navigate('/')} className="btn-back-home">Back to Home</button>
      </div>
    );
  }

  const renderProviders = (providers) => {
    if (!providers) return <p>Not available for streaming, rent, or purchase in your region.</p>;

    return (
      <div className="providers-list">
        {providers.flatrate && (
          <div className="provider-category">
            <h4>Stream</h4>
            <div className="provider-icons">
              {providers.flatrate.map(provider => (
                <a key={provider.provider_id} href={providers.link} target="_blank" rel="noopener noreferrer">
                  <img src={`https://image.tmdb.org/t/p/w45${provider.logo_path}`} alt={provider.provider_name} title={provider.provider_name} />
                </a>
              ))}
            </div>
          </div>
        )}
        {providers.rent && (
          <div className="provider-category">
            <h4>Rent</h4>
            <div className="provider-icons">
              {providers.rent.map(provider => (
                <a key={provider.provider_id} href={providers.link} target="_blank" rel="noopener noreferrer">
                  <img src={`https://image.tmdb.org/t/p/w45${provider.logo_path}`} alt={provider.provider_name} title={provider.provider_name} />
                </a>
              ))}
            </div>
          </div>
        )}
        {providers.buy && (
          <div className="provider-category">
            <h4>Buy</h4>
            <div className="provider-icons">
              {providers.buy.map(provider => (
                <a key={provider.provider_id} href={providers.link} target="_blank" rel="noopener noreferrer">
                  <img src={`https://image.tmdb.org/t/p/w45${provider.logo_path}`} alt={provider.provider_name} title={provider.provider_name} />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <motion.div 
      className="movie-details-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Hero Section */}
      <div className="movie-details-hero" style={{ backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.8) 100%), url(${movie.backdrop})` }}>
        <button className="btn-back" onClick={() => navigate(-1)}>← Back</button>
        <div className="movie-details-hero-content">
          <div className="movie-details-poster">
            <img src={movie.poster} alt={movie.title} />
          </div>
          <div className="movie-details-info">
            <h1 className="movie-details-title">{movie.title}</h1>
            <div className="movie-details-meta">
              <span className="movie-details-year">{movie.year}</span>
              <div className="movie-details-rating">
                <Star className="star-icon" />
                <span>{movie.rating}</span>
                <span className="vote-count">({movie.voteCount} votes)</span>
              </div>
              {movie.runtime && (
                <div className="movie-details-runtime">
                  <Clock className="clock-icon" />
                  <span>{formatRuntime(movie.runtime)}</span>
                </div>
              )}
            </div>
            <p className="movie-details-description">{movie.description || 'No description available.'}</p>
            <div className="movie-details-action-buttons">
              {movie.trailer && (
                <button className="btn-watch-trailer" onClick={openTrailer}>
                  <Play className="btn-icon" />
                  Watch Trailer
                </button>
              )}
              <button className="btn-download">
                <Download className="btn-icon" />
                Download
              </button>
              <button 
                className="btn-favorite"
                onClick={handleFavoriteToggle}
                style={{ 
                  backgroundColor: isFavorite ? '#FFD700' : 'transparent',
                  color: isFavorite ? 'black' : 'white',
                  borderColor: isFavorite ? '#FFD700' : 'rgba(255, 255, 255, 0.3)'
                }}
              >
                <Heart className="btn-icon" style={{ fill: isFavorite ? 'black' : 'none' }} />
                {isFavorite ? 'Favorited' : 'Favorite'}
              </button>
              <button className="btn-recommend" onClick={() => setShowRecommendModal(true)}>
                <MessageSquarePlus className="btn-icon" />
                Recommend
              </button>
              <button className="btn-create-party" onClick={() => setShowCreateWatchPartyModal(true)}>
                <CalendarPlus className="btn-icon" />
                Create Watch Party
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="movie-details-content">
        {/* Genres & Languages */}
        {(movie.genres?.length > 0 || movie.languages?.length > 0) && (
          <section className="movie-details-tags-section">
            {movie.genres?.length > 0 && (
              <div className="movie-details-genres">
                <h3>Genres</h3>
                <div className="tag-list">
                  {movie.genres.map(genre => (
                    <span key={genre.id} className="genre-tag">{genre.name}</span>
                  ))}
                </div>
              </div>
            )}
            {movie.languages?.length > 0 && (
              <div className="movie-details-languages">
                <h3>Languages</h3>
                <div className="tag-list">
                  {movie.languages.map(lang => (
                    <span key={lang.iso_639_1} className="language-tag">{lang.english_name}</span>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Where to Watch */}
        <section className="movie-details-watch-providers-section">
          <h2>Where to Watch</h2>
          {watchProviders ? renderProviders(watchProviders.US) : <p>Loading providers...</p>}
        </section>

          {/* Cast */}
          {movie.cast?.length > 0 && (
            <section className="movie-details-cast-section">
              <h2>Cast</h2>
              <div className="cast-scroll">
                {movie.cast.map(person => (
                  <div key={person.id} className="cast-card">
                    <div className="cast-image">
                      {person.profileImage ? (
                        <img src={person.profileImage} alt={person.name} />
                      ) : (
                        <div className="no-image">No Image</div>
                      )}
                    </div>
                    <div className="cast-info">
                      <h4>{person.name}</h4>
                      <p>{person.character}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Crew */}
          {movie.crew?.length > 0 && (
            <section className="movie-details-crew-section">
              <h2>Crew</h2>
              <div className="crew-scroll">
                {movie.crew.map(person => (
                  <div key={`${person.id}-${person.job}`} className="crew-card">
                    <div className="crew-image">
                      {person.profileImage ? (
                        <img src={person.profileImage} alt={person.name} />
                      ) : (
                        <div className="no-image">No Image</div>
                      )}
                    </div>
                    <div className="crew-info">
                      <h4>{person.name}</h4>
                      <p>{person.job}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Similar Movies */}
          {movie.similar?.length > 0 && (
            <section className="movie-details-similar-section">
              <h2>You Might Also Like</h2>
              <div className="similar-scroll">
                {movie.similar.map(similarMovie => (
                  <div 
                    key={similarMovie.id} 
                    className="similar-card"
                    onClick={() => onMovieClick && onMovieClick(similarMovie.id)}
                  >
                    <img src={similarMovie.poster} alt={similarMovie.title} />
                    <div className="similar-info">
                      <h4>{similarMovie.title}</h4>
                      <div className="similar-rating">
                        <Star className="star-icon" />
                        <span>{similarMovie.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

      {/* Recommend Movie Modal */}
      {showRecommendModal && (
        <RecommendMovieModal
          movie={movie}
          senderId={user?.uid}
          onClose={() => setShowRecommendModal(false)}
        />
      )}

      {/* Create Watch Party Modal */}
      {showCreateWatchPartyModal && (
        <CreateWatchPartyModal
          movie={movie}
          organizerId={user?.uid}
          onClose={() => setShowCreateWatchPartyModal(false)}
        />
      )}
    </motion.div>
  );
};

export default MovieDetailsPage;