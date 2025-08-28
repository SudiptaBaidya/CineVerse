const API_KEY = '1fc967b1060217a3addb03a2e7d4d58c'; // Replace with your actual TMDB API key
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export const tmdbAPI = {
  // Get trending movies
  getTrending: async () => {
    try {
      const response = await fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`);
      const data = await response.json();
      return data.results?.map(movie => ({
        id: movie.id,
        title: movie.title,
        poster: `${IMAGE_BASE_URL}${movie.poster_path}`,
        backdrop: `https://image.tmdb.org/t/p/original${movie.backdrop_path}`,
        rating: movie.vote_average?.toFixed(1),
        year: new Date(movie.release_date).getFullYear(),
        description: movie.overview,
        popularity: movie.popularity?.toFixed(1)
      })) || [];
    } catch (error) {
      console.error('Error fetching trending movies:', error);
      return [];
    }
  },

  // Get popular movies
  getPopular: async () => {
    try {
      const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
      const data = await response.json();
      return data.results?.map(movie => ({
        id: movie.id,
        title: movie.title,
        poster: `${IMAGE_BASE_URL}${movie.poster_path}`,
        backdrop: `https://image.tmdb.org/t/p/original${movie.backdrop_path}`,
        rating: movie.vote_average?.toFixed(1),
        year: new Date(movie.release_date).getFullYear(),
        description: movie.overview,
        popularity: movie.popularity?.toFixed(1)
      })) || [];
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      return [];
    }
  },

  // Get movie recommendations
  getRecommendations: async (movieId = 550) => {
    try {
      const response = await fetch(`${BASE_URL}/movie/${movieId}/recommendations?api_key=${API_KEY}`);
      const data = await response.json();
      return data.results?.map(movie => ({
        id: movie.id,
        title: movie.title,
        poster: `${IMAGE_BASE_URL}${movie.poster_path}`,
        backdrop: `https://image.tmdb.org/t/p/original${movie.backdrop_path}`,
        rating: movie.vote_average?.toFixed(1),
        year: new Date(movie.release_date).getFullYear(),
        description: movie.overview,
        popularity: movie.popularity?.toFixed(1)
      })) || [];
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      return [];
    }
  }
};