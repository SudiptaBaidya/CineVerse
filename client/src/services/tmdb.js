const API_KEY = '1fc967b1060217a3addb03a2e7d4d58c'; // Replace with your actual TMDB API key
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const PROFILE_BASE_URL = 'https://image.tmdb.org/t/p/w185';

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
  },

  // Get movie details with credits and videos
  getMovieDetails: async (movieId) => {
    try {
      const response = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=credits,videos,similar`);
      const movie = await response.json();
      
      return {
        id: movie.id,
        title: movie.title,
        poster: `${IMAGE_BASE_URL}${movie.poster_path}`,
        backdrop: `https://image.tmdb.org/t/p/original${movie.backdrop_path}`,
        rating: movie.vote_average?.toFixed(1),
        voteCount: movie.vote_count,
        year: new Date(movie.release_date).getFullYear(),
        runtime: movie.runtime,
        description: movie.overview,
        popularity: movie.popularity?.toFixed(1),
        genres: movie.genres || [],
        languages: movie.spoken_languages || [],
        cast: movie.credits?.cast?.slice(0, 10).map(person => ({
          id: person.id,
          name: person.name,
          character: person.character,
          profileImage: person.profile_path ? `${IMAGE_BASE_URL}${person.profile_path}` : null
        })) || [],
        crew: movie.credits?.crew?.filter(person => 
          ['Director', 'Producer', 'Writer', 'Screenplay'].includes(person.job)
        ).map(person => ({
          id: person.id,
          name: person.name,
          job: person.job,
          profileImage: person.profile_path ? `${IMAGE_BASE_URL}${person.profile_path}` : null
        })) || [],
        trailer: movie.videos?.results?.find(video => 
          video.type === 'Trailer' && video.site === 'YouTube'
        )?.key || null,
        similar: movie.similar?.results?.slice(0, 10).map(similarMovie => ({
          id: similarMovie.id,
          title: similarMovie.title,
          poster: `${IMAGE_BASE_URL}${similarMovie.poster_path}`,
          rating: similarMovie.vote_average?.toFixed(1)
        })) || []
      };
    } catch (error) {
      console.error('Error fetching movie details:', error);
      return null;
    }
  }
};