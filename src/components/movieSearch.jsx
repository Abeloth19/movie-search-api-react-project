import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Movie = ({ movie }) => {
  const imdbUrl = `https://www.imdb.com/title/${movie.imdbID}`;

  return (
    <div className="movie" onClick={() => window.open(imdbUrl)}>
      <h3 className="movie-title">{movie.Title}</h3>
      <div className="movie-info">
        <span className="movie-year">{movie.Year}</span>
        <span className="movie-type">{movie.Type}</span>
      </div>
      <img className="movie-poster" src={movie.Poster} alt={`${movie.Title} Poster`} />
    </div>
  );
};

const MovieList = ({ movies }) => {
  return (
    <div className="movie-list">
      {movies.map(movie => (
        <Movie key={movie.imdbID} movie={movie} />
      ))}
    </div>
  );
};

const Search = ({ searchMovies }) => {
  const [searchValue, setSearchValue] = useState('');

  const handleInputChange = event => {
    setSearchValue(event.target.value);
  };

  const handleSearchClick = event => {
    event.preventDefault();
    searchMovies(searchValue);
  };

  return (
    <form className="search">
      <input
        className="search-input"
        type="text"
        placeholder="Search for a movie..."
        value={searchValue}
        onChange={handleInputChange}
      />
      <button className="search-button" onClick={handleSearchClick}>Search</button>
    </form>
  );
};

const App = () => {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get('https://www.omdbapi.com', {
          params: {
            apikey: 'your_api_key',
            s: 'batman'
          }
        });

        if (response.data.Response === 'True') {
          setMovies(response.data.Search);
        } else {
          setError(response.data.Error);
        }
      } catch (error) {
        setError('An error occurred while fetching the movies. Please try again later.');
      }

      setIsLoading(false);
    };

    fetchMovies();
  }, []);

  const searchMovies = async searchValue => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get('https://www.omdbapi.com', {
        params: {
          apikey: 'c1b6b35',
          s: searchValue
        }
      });

      if (response.data.Response === 'True') {
        setMovies(response.data.Search);
      } else {
        setError(response.data.Error);
      }
    } catch (error) {
      setError('An error occurred while searching for movies. Please try again later.');
    }

    setIsLoading(false);
  };

  return (
    <div className="container">
      <h1 className="title">Movie Search</h1>
      <Search searchMovies={searchMovies} />
      {error ? <div className="error">{error}</div> : null}
      {isLoading ? <div className="loading">Loading...</div> : null}
      {movies.length > 0 ? <MovieList movies={movies} /> : null}
    </div>
  );
};

export default App;
