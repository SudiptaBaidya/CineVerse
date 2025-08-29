import { useState, useEffect, useContext } from 'react';
import { tmdbAPI } from '../services/tmdb';
import MovieSection from '../components/MovieSection';
import { SettingsContext } from '../contexts/SettingsContext';

const MoviesPage = ({ onMovieClick, favorites, onToggleFavorite }) => {
  const { includeAdult } = useContext(SettingsContext);
  const [nowPlaying, setNowPlaying] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [topRated, setTopRated] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const nowPlayingMovies = await tmdbAPI.getNowPlaying(includeAdult);
        setNowPlaying(nowPlayingMovies);

        const upcomingMovies = await tmdbAPI.getUpcoming(includeAdult);
        setUpcoming(upcomingMovies);

        const topRatedMovies = await tmdbAPI.getTopRated(includeAdult);
        setTopRated(topRatedMovies);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchMovies();
  }, [includeAdult]);

  return (
    <div className="movies-page">
      <MovieSection
        title="Now Playing"
        movies={nowPlaying}
        onMovieClick={onMovieClick}
        favorites={favorites}
        onToggleFavorite={onToggleFavorite}
      />
      <MovieSection
        title="Upcoming"
        movies={upcoming}
        onMovieClick={onMovieClick}
        favorites={favorites}
        onToggleFavorite={onToggleFavorite}
      />
      <MovieSection
        title="Top Rated"
        movies={topRated}
        onMovieClick={onMovieClick}
        favorites={favorites}
        onToggleFavorite={onToggleFavorite}
      />
    </div>
  );
};

export default MoviesPage;
