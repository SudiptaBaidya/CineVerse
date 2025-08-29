import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Download, Star, Clock, Youtube, MessageSquarePlus, CalendarPlus, Heart } from 'lucide-react';
import RecommendMovieModal from './RecommendMovieModal';
import CreateWatchPartyModal from './CreateWatchPartyModal';
import { tmdbAPI } from '../services/tmdb';
import './MovieDetails.css';

const MovieDetails = ({ movieId, onClose, onMovieClick, user }) => {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRecommendModal, setShowRecommendModal] = useState(false);
  const [showCreateWatchPartyModal, setShowCreateWatchPartyModal] = useState(false);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      setLoading(true);
      try {
        const movieData = await tmdbAPI.getMovieDetails(movieId);
        // Debug logs removed for production
        setMovie(movieData);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (movieId) {
      fetchMovieDetails();
    }
  }, [movieId]);

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

  if (loading) {
    return (
      <div className="movie-details-overlay">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading movie details...</p>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="movie-details-overlay">
        <div className="error-container">
          <p>Movie not found</p>
          <button onClick={onClose} className="btn-watch">Close</button>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="movie-details-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className="movie-details-container"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="btn-close-x" onClick={onClose}>×</button>
        
        {/* Hero Section */}
        <div className="movie-hero">
          {/* Removed the purple banner overlay */}
          
          <div className="hero-content">
            <div className="movie-poster">
              <img src={movie.poster} alt={movie.title} />
            </div>
            <div className="movie-info">
              <h1 className="movie-title">{movie.title}</h1>
              <div className="movie-meta">
                <span className="year">{movie.year}</span>
                <div className="rating">
                  <Star className="star-icon" />
                  <span>{movie.rating}</span>
                  <span className="vote-count">({movie.voteCount} votes)</span>
                </div>
                {movie.runtime && (
                  <div className="runtime">
                    <Clock className="clock-icon" />
                    <span>{formatRuntime(movie.runtime)}</span>
                  </div>
                )}
              </div>
              <div className="action-buttons">
                {movie.trailer ? (
                  <button className="btn-watch">
                    <Play className="btn-icon" />
                    Watch Now
                  </button>
                ) : (
                  <button className="btn-watch" disabled>
                    <Play className="btn-icon" />
                    Not Available
                  </button>
                )}
                <button className="btn-download">
                  <Download className="btn-icon" />
                  Download
                </button>
                <button className="btn-favorite">
                  <Heart className="btn-icon" />
                  Favorite
                </button>
                <button className="btn-recommend" onClick={() => setShowRecommendModal(true)}>
                  <MessageSquarePlus className="btn-icon" />
                  Recommend
                </button>
                <button className="btn-create-party" onClick={() => setShowCreateWatchPartyModal(true)}>
                  <CalendarPlus className="btn-icon" />
                  Create Watch Party
                </button>
                {movie.trailer && (
                  <button className="btn-trailer" onClick={openTrailer}>
                    <Youtube className="btn-icon" />
                    Watch Trailer
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="movie-content">
          {/* Overview */}
          <section className="overview-section">
            <h2>Overview</h2>
            <div className="description">
              <p>{movie.description || 'No description available.'}</p>
            </div>
          </section>



          {/* Genres & Languages */}
          {(movie.genres?.length > 0 || movie.languages?.length > 0) && (
            <section className="tags-section">
              {movie.genres?.length > 0 && (
                <div className="genres">
                  <h3>Genres</h3>
                  <div className="tag-list">
                    {movie.genres.map(genre => (
                      <span key={genre.id} className="genre-tag">{genre.name}</span>
                    ))}
                  </div>
                </div>
              )}
              {movie.languages?.length > 0 && (
                <div className="languages">
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

          {/* Cast */}
          {movie.cast?.length > 0 && (
            <section className="cast-section">
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
            <section className="crew-section">
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
            <section className="similar-section">
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
      </motion.div>

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

export default MovieDetails;