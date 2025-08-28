import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Heart, Star } from 'lucide-react';
import { tmdbAPI } from '../services/tmdb';
import './MovieSection.css';

const MovieSection = ({ title = "You Might Like", type = "recommendations", onMovieClick }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredMovie, setHoveredMovie] = useState(null);
  const [favorites, setFavorites] = useState(new Set());

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        let movieData = [];
        
        switch (type) {
          case 'trending':
            movieData = await tmdbAPI.getTrending();
            break;
          case 'popular':
            movieData = await tmdbAPI.getPopular();
            break;
          case 'recommendations':
          default:
            movieData = await tmdbAPI.getRecommendations();
            break;
        }
        
        setMovies(movieData.slice(0, 10)); // Limit to 10 movies
      } catch (error) {
        console.error('Error fetching movies:', error);
        // Fallback to sample data if API fails
        setMovies([
          {
            id: 1,
            title: "Spider-Man: No Way Home",
            poster: "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
            rating: 8.2
          },
          {
            id: 2,
            title: "The Batman",
            poster: "https://image.tmdb.org/t/p/w500/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg",
            rating: 7.8
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [type]);

  const toggleFavorite = (movieId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(movieId)) {
        newFavorites.delete(movieId);
      } else {
        newFavorites.add(movieId);
      }
      return newFavorites;
    });
  };

  const handleMovieClick = (movieId, event) => {
    event.preventDefault();
    console.log('Movie clicked:', movieId); // Debug log
    if (onMovieClick) {
      onMovieClick(movieId);
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4 }
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  const buttonVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.3, delay: 0.1 }
    }
  };

  if (loading) {
    return (
      <div className="movie-section">
        <div className="section-header">
          <h2 className="section-title">{title}</h2>
          <div className="title-underline"></div>
        </div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading movies...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.section 
      className="movie-section"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={sectionVariants}
    >
      <div className="section-header">
        <h2 className="section-title">{title}</h2>
        <div className="title-underline"></div>
      </div>

      <div className="movies-container">
        <div className="scroll-shadow scroll-shadow-left"></div>
        <div className="scroll-shadow scroll-shadow-right"></div>
        
        <div className="movies-scroll">
          {movies.map((movie, index) => (
            <motion.div
              key={movie.id}
              className="movie-card"
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              onHoverStart={() => setHoveredMovie(movie.id)}
              onHoverEnd={() => setHoveredMovie(null)}
              onClick={(e) => handleMovieClick(movie.id, e)}
            >
              <div className="movie-poster-container">
                <img 
                  src={movie.poster} 
                  alt={movie.title}
                  className="movie-poster"
                  loading="lazy"
                />
                
                {hoveredMovie === movie.id && (
                  <motion.div 
                    className="movie-overlay"
                    variants={overlayVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <motion.div 
                      className="overlay-buttons"
                      variants={buttonVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <button 
                        className="btn-watch-overlay"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMovieClick(movie.id, e);
                        }}
                      >
                        <Play className="btn-icon" />
                        Watch
                      </button>
                      <motion.button 
                        className={`btn-favorite ${favorites.has(movie.id) ? 'favorited' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(movie.id);
                        }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Heart className={`heart-icon ${favorites.has(movie.id) ? 'filled' : ''}`} />
                        Favorite
                      </motion.button>
                    </motion.div>
                  </motion.div>
                )}
              </div>
              
              <div className="movie-info">
                <h3 className="movie-title">{movie.title}</h3>
                <div className="movie-rating">
                  <Star className="star-icon" />
                  <span>{movie.rating}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default MovieSection;