import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../CSS/SearchForm.css";

const SearchForm = () => {
	const [search, setSearch] = useState("");
	const [resource, setResource] = useState("people"); // default
	const navigate = useNavigate();
	const location = useLocation();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const trimmed = search.trim();
		if (!trimmed) return;

		navigate(`/${resource}?query=${encodeURIComponent(trimmed)}&page=1`);
		setSearch("");
	};

	return (
		<form onSubmit={handleSubmit} className="searchbar-form">
			<select
				className="searchbar-select"
				value={resource}
				onChange={(e) => setResource(e.target.value)}
			>
				<option value="people">People</option>
				<option value="planets">Planets</option>
				<option value="films">Films</option>
				<option value="species">Species</option>
				<option value="vehicles">Vehicles</option>
				<option value="starships">Starships</option>
			</select>

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
