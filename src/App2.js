import { useState } from "react";
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
import useMovies from "./useMovies";
import useLocalStorageState from "./useLocalStorageState";

export const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
  const [query, setQuery] = useState('');
  const [selectedID, setSelectedID] = useState(null);
  const { movies, isLoading, error } = useMovies(query);
  const [watched, setWatched] = useLocalStorageState([], 'watched');

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
