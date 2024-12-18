import { useEffect, useState } from "react";
import { MovieList } from "./MovieList";
import { Box } from "./Box";
import { Main } from "./Main";
import { NumRusults } from "./NumRusults";
import { Search } from "./Search";
import { Logo } from "./Logo";
import { NavBar } from "./NavBar";
import { Loader } from "./Loader";
import { ErrorMessage } from "./ErrorMessage";
import { WatchedSummary } from "./WatchedSummary";
import { WatchedMoviesList } from "./WatchedMoviesList";
import { MovieDetails } from "./MovieDetails";
import { APIKEY } from "./APIKEY";

export const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [selectedID, setSelectedID] = useState(null);
  const [watched, setWatched] = useState(function () {
    const storedValue = localStorage.getItem('watched');
    return JSON.parse(storedValue);
  });

  function handleAddWatched(movie) {
    setWatched(watched => [...watched, movie]);
  }

  function handleSelectMovie(id) {
    setSelectedID(selectedID => selectedID === id ? null : id);
  }

  function handleCloseMovie() {
    setSelectedID(null);
  }

  function handleDeleteWatched(id) {
    setWatched(watched => watched.filter(movie => movie.imdbID !== id))
  }

  useEffect(function () {
    localStorage.setItem('watched', JSON.stringify(watched))
  }, [watched])

  useEffect(function () {
    const controller = new AbortController();

    async function fetchMovies() {
      try {
        setIsLoading(true);
        setError('');

        const res = await fetch(`http://www.omdbapi.com/?apikey=${APIKEY}&s=${query}`, { signal: controller.signal });

        if (!res.ok) throw new Error('Smth went wrong with fetching movies');
        const data = await res.json();
        if (data.Response === "False") throw new Error('Movie not found');

        setMovies(data.Search || []);
        setError('');
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    if (query.length < 3) {
      setMovies([]);
      setError('');
      return
    }

    handleCloseMovie();
    fetchMovies();

    return function () {
      controller.abort();
    }
  }, [query]);

  return (
    <>
      <NavBar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumRusults movies={movies} />
      </NavBar>

      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && <MovieList movies={movies} handleSelectMovie={handleSelectMovie} />}
          {error && <ErrorMessage message={error} />}
        </Box>

        <Box >
          {selectedID ?
            <MovieDetails
              selectedID={selectedID}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatched}
              watched={watched} />
            :
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList watched={watched} onDeleteWatched={handleDeleteWatched} />
            </>}
        </Box>
      </Main >
    </>
  );
}
