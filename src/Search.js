import { useRef } from "react";
import useKey from "./useKey";

export function Search({ query, setQuery }) {
    const inputRl = useRef(null)

    useKey(function () {
        if (document.activeElement === inputRl.current) return;
        inputRl.current.focus();
        setQuery('');
    }, 'Enter');

    return <input
        ref={inputRl}
        className="search"
        type="text"
        placeholder="Search movies..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
    />;
}
