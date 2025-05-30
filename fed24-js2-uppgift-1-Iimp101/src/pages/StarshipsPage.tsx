import { useEffect, useState } from "react";
import { getStarshipList } from "../services/StarwarsPediaAPI";
import type { Starship } from "../services/StarwarsPedia.types";
import { useSearchParams, Link } from "react-router-dom";
import LoadingGif from "../components/LoadingGif";
import Pagination from "../components/Pagination";
import starshipImages from "../data/StarshipImages";
import "../CSS/StarshipPage.css";

const StarshipPage = () => {
	const [starships, setStarships] = useState<Starship[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [searchParams, setSearchParams] = useSearchParams();

	const page = parseInt(searchParams.get("page") || "1");
	const query = searchParams.get("query") || "";
	const starshipsPerPage = 8;

	useEffect(() => {
		const fetchAllStarships = async () => {
			setIsLoading(true);
			setError(null);

			try {
				const res = await getStarshipList(1, query);
				await new Promise(r => setTimeout(r, 1500));
				let results = [...res.data];
				const total = res.last_page;

				const promises = [];
				for (let p = 2; p <= total; p++) {
					promises.push(getStarshipList(p, query));
				}
				const others = await Promise.all(promises);
				others.forEach(res => results = results.concat(res.data));

				setStarships(results);
			} catch (err) {
				setError(err instanceof Error 
					? err.message 
					: "Failed to load starships");
			}

			setIsLoading(false);
		};

		fetchAllStarships();
	}, [query]);

	const totalPages = Math.ceil(starships.length / starshipsPerPage);
	const startIndex = (page - 1) * starshipsPerPage;
	const visibleStarships = starships.slice(startIndex, startIndex + starshipsPerPage);

	const goToPage = (newPage: number) => {
		const newParams: Record<string, string> = { page: newPage.toString() };
		if (query) newParams.query = query;
		setSearchParams(newParams);
	};

	return (
		<div className="starship-page">
			<h1 className="page-title with-lightsabers">
				<img src="/GIFS/lightsaberBlue2.gif" 
				alt="Blue Lightsaber" 
				className="lightsaber left" 
				/>
				Star wars Starships
				<img src="/GIFS/lightsaberRed2.gif" 
				alt="Red Lightsaber" 
				className="lightsaber right" 
				/>
			</h1>

			{query && <h2 className="search-results-heading">Search results for "{query}"</h2>}

			{isLoading && <LoadingGif />}
			{error && <p className="error-msg">{error}</p>}

			{!isLoading && !error && visibleStarships.length > 0 && (
				<ul className="starship-list">
					{visibleStarships.map((ship) => (
						<li key={ship.id}>
							<Link to={`/starships/${ship.id}`} className="starship-card-link">
								<div className="starship-card">
									<img src={starshipImages[ship.id]} alt={ship.name} className="starship-image" />
									<div className="starship-info">
										<h3>{ship.name}</h3>
										<p><strong>Cost:</strong> {ship.cost_in_credits} credits</p>
										<p><strong>Length:</strong> {ship.length} m</p>
										<p><strong>Crew:</strong> {ship.crew}</p>
										<p><strong>Passengers:</strong> {ship.passengers}</p>
										<p><strong>Max Speed:</strong> {ship.max_atmosphering_speed} km/h</p>
										<p><strong>Hyperdrive Rating:</strong> {ship.hyperdrive_rating}</p>
										<p><strong>Consumables:</strong> {ship.consumables}</p>
										<p><strong>Films:</strong> {ship.films_count}</p>
									</div>
								</div>
							</Link>
						</li>
					))}
				</ul>
			)}

			{!isLoading && !error && starships.length > 0 && (
				<Pagination
					page={page}
					totalPages={totalPages}
					hasPreviousPage={page > 1}
					hasNextPage={page < totalPages}
					onPreviousPage={() => goToPage(page - 1)}
					onNextPage={() => goToPage(page + 1)}
					onFirstPage={() => goToPage(1)}
					onLastPage={() => goToPage(totalPages)}
				/>
			)}

			{!isLoading && !error && starships.length === 0 && (
				<p className="no-results-msg">No results found for "{query}"</p>
			)}
		</div>
	);
};

export default StarshipPage;
