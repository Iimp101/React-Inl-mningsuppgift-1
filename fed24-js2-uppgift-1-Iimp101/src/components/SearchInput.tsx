import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/SearchInput.css";

const SearchBar = () => {
	const [search, setSearch] = useState("");
	const navigate = useNavigate();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const trimmed = search.trim();
		if (trimmed.length < 2) return;
		navigate(`/search?query=${trimmed}&page=1`);
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

export default SearchBar;
