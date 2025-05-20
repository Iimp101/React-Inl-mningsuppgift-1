import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/HomePage.css";

const HomePage = () => {
	const [search, setSearch] = useState("");
	const navigate = useNavigate();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (search.trim().length < 1) return;
		navigate(`/search/people?query=${search.trim()}&page=1`);
	};

	return (
		<div className="homepage-container">
			<div className="homepage-overlay">
				<h1 className="homepage-title">Starwars Encyclopedia</h1>
				<p className="homepage-subtitle">Discover characters, ships, planets and more...</p>

				<form onSubmit={handleSubmit} className="search-form">
					<input
						type="text"
						placeholder="Search for a character..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="search-input"
					/>
					<button type="submit" className="search-button">
						Search
					</button>
				</form>
			</div>
		</div>
	);
};

export default HomePage;
