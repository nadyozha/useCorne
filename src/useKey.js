import { useEffect } from "react";

export default function useKey(action, key) {
	useEffect(function () {
		function keypress(e) {
			if (e.code.toLowerCase() === key.toLowerCase()) action();
		}
		document.addEventListener('keydown', keypress);

		return function () {
			document.removeEventListener('keydown', keypress);
		}
	}, [action, key]);
}