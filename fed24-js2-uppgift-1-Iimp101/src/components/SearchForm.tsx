import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../CSS/SearchForm.css";

const SearchForm = () => {
	const [search, setSearch] = useState("");
	const navigate = useNavigate();
	const location = useLocation();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const trimmed = search.trim();

		// Hindra tomma sökningar
		if (!trimmed) return;

		// Lista över tillåtna sökvägar
		const validPaths = [
			"films",
			"people",
			"planets",
			"species",
			"starships",
			"vehicles"
		];

		// Ta ut resursnamnet från aktuell path
		const currentPath = location.pathname.split("/")[1]; // t.ex. "people"

		// Om vi befinner oss på en giltig sida → använd den
		if (validPaths.includes(currentPath)) {
			navigate(`/${currentPath}?query=${encodeURIComponent(trimmed)}&page=1`);
		} else {
			// Om man t.ex. står på startsidan eller fel sida → default till people
			navigate(`/people?query=${encodeURIComponent(trimmed)}&page=1`);
		}

		setSearch("");
	};

	return (
		<form onSubmit={handleSubmit} className="searchbar-form">
			<input
				type="text"
				placeholder="Search..."
				value={search}
				onChange={(e) => setSearch(e.target.value)}
				className="searchbar-input"
			/>
			<button type="submit" className="searchbar-button">
				<img
					src="/images/icons/lightsabericon.png"
					alt="Search"
					className="lightsaber-icon"
				/>
			</button>
		</form>
	);
};

export default SearchForm;
