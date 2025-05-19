import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
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
			{/* Star Wars Theme sound */}
			<audio autoPlay loop>
				<source src="/sounds/starwars-theme.mp3" type="audio/mpeg" />
			</audio>

			<div className="homepage-overlay">
				<h1 className="display-4 text-warning mb-4">Star Wars Encyclopedia</h1>
				<p className="text-light mb-5">Discover characters, ships, planets and more...</p>

				<Form onSubmit={handleSubmit} className="w-100" style={{ maxWidth: 500 }}>
					<Form.Control
						type="text"
						placeholder="Search for a character..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="bg-dark text-warning border-warning"
					/>
					<div className="d-flex justify-content-end mt-2">
						<Button variant="warning" type="submit">Search</Button>
					</div>
				</Form>
			</div>
		</div>
	);
};

export default HomePage;
