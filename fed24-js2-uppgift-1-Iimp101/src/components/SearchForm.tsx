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
		// Giltiga resursrutter – för att förhindra att man försöker söka från startsidan
		const validPaths = [
			"/films",
			"/people",
			"/planets",
			"/species",
			"/starships",
			"/vehicles"
		];

		const currentPath = location.pathname;

		if (validPaths.includes(currentPath)) {
			const queryParam = encodeURIComponent(trimmed);
			navigate(`${currentPath}?query=${queryParam}&page=1`);
		} else {
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
