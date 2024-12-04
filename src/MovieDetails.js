import { useState, useEffect } from "react";
import { APIKEY } from "./APIKEY";
import { Loader } from "./Loader";
import StarRating from "./StarRating";
import useKey from "./useKey";

export function MovieDetails({ selectedID, onCloseMovie, onAddWatched, watched }) {
    const [movie, setMovie] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [userRating, setUserRating] = useState('');

    const isWatched = watched.map(item => item.imdbID).includes(selectedID);
    const watchedUserRating = watched.find(item => item.imdbID === selectedID)?.userRating;

    const {
        Title: title, Year: year, Poster: poster, Runtime: runtime, imdbRating, Plot: plot,
        //Released, released,
        Actors: actots, Director: direcor, Genre: genre
    } = movie;

    function handleAdd() {
        const newWatchedMovie = {
            imdbID: selectedID,
            title,
            year,
            poster,
            runtime: Number(runtime.split(' ').at(0)),
            imdbRating: Number(imdbRating),
            userRating,
        };

        onAddWatched(newWatchedMovie);
        onCloseMovie();
    }

    useKey(onCloseMovie, 'Escape');

    useEffect(function () {
        if (!title) return;
        document.title = `Movie | ${title}`;
        return function () {
            document.title = 'usePopcorn';
        };
    }, [title]);

    useEffect(function () {
        async function getMovieDetails() {
            setIsLoading(true);
            const res = await fetch(`https://www.omdbapi.com/?apikey=${APIKEY}&i=${selectedID}`);
            const data = await res.json();
            setMovie(data);
            setIsLoading(false);
        }

        getMovieDetails();
    }, [selectedID]);

    return (
        <div className="details">
            {!isLoading ? <>
                <header>
                    <button className="btn-back" onClick={onCloseMovie}>&larr;</button>
                    <img src={poster} alt={title} />
                    <div className="details-overview">
                        <h2>{title}</h2>
                        <p>{year} &bull; {runtime}</p>
                        <p>{genre}</p>
                        <p><span>⭐️</span>{imdbRating} IMDB rating</p>
                    </div>
                </header>
                <section>

                    <div className="rating">
                        {!isWatched ? (
                            <>
                                <StarRating
                                    size={24}
                                    onSetReting={setUserRating} />
                                {userRating > 0 && (
                                    <button className="btn-add"
                                        onClick={handleAdd}>+ Add to list</button>
                                )}
                            </>
                        ) : (<p> You rated this movie {watchedUserRating} <span>🌟</span></p>
                        )}
                    </div>
                    <p><em>{plot}</em></p>
                    <p>Starring {actots}</p>
                    <p>Directed by {direcor}</p>
                </section>
            </> : <Loader />}
        </div>);
}
