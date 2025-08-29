import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Download, Star, Heart } from 'lucide-react';
import { tmdbAPI } from '../services/tmdb';
import './HeroBanner.css';

const HeroBanner = ({ onMovieClick, favorites = [], onToggleFavorite }) => {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const movieIndexRef = useRef(0);

  useEffect(() => {
    const fetchTrendingMovies = async () => {
      try {
        const movies = await tmdbAPI.getTrending();
        if (movies?.length > 0) {
          setTrendingMovies(movies);
          setMovie(movies[0]); // Set the first movie initially
        }
      } catch (error) {
        console.error('Error fetching hero movie:', error);
        // Fallback movie data
        setMovie({
          title: "Avengers: Endgame",
          year: "2019",
          rating: "8.4",
          description: "After the devastating events of Avengers: Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos' actions and restore balance to the universe.",
          backdrop: "https://image.tmdb.org/t/p/original/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg",
          poster: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
          popularity: "95.2"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingMovies();
  }, []);

  useEffect(() => {
    if (trendingMovies.length > 0) {
      const interval = setInterval(() => {
        movieIndexRef.current = (movieIndexRef.current + 1) % trendingMovies.length;
        setMovie(trendingMovies[movieIndexRef.current]);
      }, 90000); // Change movie every 90 seconds (1.5 minutes)

      return () => clearInterval(interval);
    }
  }, [trendingMovies]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6 }
    }
  };

  const cardVariants = {
    hidden: { x: 50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.8, delay: 0.4 }
    }
  };

  if (loading || !movie) {
    return (
      <div className="hero-banner hero-loading">
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="hero-banner"
      style={{ backgroundImage: `url(${movie.backdrop})` }}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="hero-overlay"></div>
      
      <div className="hero-content">
        {/* Left Side - Movie Details */}
        <div className="hero-details">
          <motion.h1 className="hero-title" variants={itemVariants}>
            {movie.title}
          </motion.h1>
          
          <motion.div className="hero-meta" variants={itemVariants}>
            <span className="hero-year">{movie.year}</span>
            <div className="hero-rating">
              <Star className="star-icon" />
              <span>{movie.rating}</span>
            </div>
          </motion.div>
          
          <motion.p className="hero-description" variants={itemVariants}>
            {movie.description}
          </motion.p>
          
          <motion.div className="hero-buttons" variants={itemVariants}>
            <button 
              className="btn-watch"
              onClick={() => onMovieClick && onMovieClick(movie.id)}
            >
              <Play className="btn-icon" />
              Watch Now
            </button>
            <button 
              className={`btn-favorite ${favorites.some(fav => fav.id === movie.id) ? 'favorited' : ''}`}
              onClick={() => onToggleFavorite && onToggleFavorite(movie)}
            >
              <Heart className={`btn-icon ${favorites.some(fav => fav.id === movie.id) ? 'filled' : ''}`} />
              {favorites.some(fav => fav.id === movie.id) ? 'Remove' : 'Favorite'}
            </button>
            <button className="btn-download">
              <Download className="btn-icon" />
              Download
            </button>
          </motion.div>
        </div>

        {/* Right Side - Info Card */}
        <motion.div 
          className="hero-info-card"
          variants={cardVariants}
        >
          <div className="info-card-content">
            <img src={movie.poster} alt={movie.title} className="info-poster" />
            
            <div className="info-details">
              <div className="info-item">
                <span className="info-label">Release Year</span>
                <span className="info-value">{movie.year}</span>
              </div>
              
              <div className="info-item">
                <span className="info-label">IMDb Rating</span>
                <div className="info-rating">
                  <Star className="info-star" />
                  <span className="info-value">{movie.rating}</span>
                </div>
              </div>
              
              <div className="info-item">
                <span className="info-label">Popularity</span>
                <span className="info-value">{movie.popularity}%</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default HeroBanner;