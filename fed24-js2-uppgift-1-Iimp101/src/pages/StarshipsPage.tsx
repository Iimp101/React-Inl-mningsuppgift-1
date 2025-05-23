import { useState, useEffect } from "react";
import { getStarshipList } from "../services/StarwarsPediaAPI";
import type { Starship, SWAPIListResponse } from "../services/StarwarsPedia.types";
import { useSearchParams } from "react-router-dom";
import LoadingPagesGif from "../components/LoadingPagesGif";
import Pagination from "../components/Pagination";
import starshipImages from "../data/StarshipImages";
import "../CSS/StarshipPage.css";

const StarshipPage = () => {

	const [starship, setStarship] = useState<Starship[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [totalPages, setTotalPages] = useState<number>(1);
	const [searchParams, setSearchParams] = useSearchParams();

	const currentPage = parseInt(searchParams.get("page") || "1");

	useEffect(() => {
		const fetchStarship = async () => {
			setIsLoading(true);
			setError(null);

			try {
				const response: SWAPIListResponse<Starship> = await getStarshipList(currentPage);
				await new Promise(r => setTimeout(r, 1500)); 
				setStarship(response.data);
				setTotalPages(response.last_page);
			}
			catch (err) {
			setError(err instanceof Error
				? err.message
				: "Failed to load starship"
				)
			}

			setIsLoading(false);
		};

		fetchStarship();
	}, [currentPage]);

	const goToPage = (newPage: number) => {
		setSearchParams( {page: newPage.toString() });
	};

	return (
  	<div className="starship-page">
    	<h1 className="page-title with-lightsabers">
			<img
				src="/GIFS/lightsaberBlue2.gif"
				alt="Blue Lightsaber"
				className="lightsaber left"
			/>
				Starwars Starships
			<img
				src="/GIFS/lightsaberRed2.gif"
				alt="Red Lightsaber"
				className="lightsaber right"
			/>
    	</h1>

    {isLoading && <LoadingPagesGif />}
    {error && <p className="error-msg">{error}</p>}

    {!isLoading && !error && (
      <ul className="starship-list">
        {starship.map((ship) => (
          <li key={ship.id} className="starship-card">
            <img
				src={starshipImages[ship.id]}
				alt={ship.name}
				className="starship-image"
			/>

            <div className="starship-info">
				<h3>{ship.name}</h3>
				<p><strong>Cost:</strong> {ship.cost_in_credits} credits</p>
				<p><strong>Length:</strong> {ship.length} m</p>
				<p><strong>Crew:</strong> {ship.crew}</p>
				<p><strong>Passengers:</strong> {ship.passengers}</p>
				<p><strong>Max Speed:</strong> {ship.max_atmosphering_speed} km/h</p>
				<p><strong>Hyperdrive Rating:</strong> {ship.hyperdrive_rating}</p>
				<p><strong>MGLT:</strong> {ship.MGLT}</p>
				<p><strong>Consumables:</strong> {ship.consumables}</p>
				<p><strong>Films:</strong> {ship.films_count}</p>
            </div>
          </li>
        ))}
      </ul>
    )}

    {!isLoading && !error && starship.length > 0 && (
    	<Pagination
			page={currentPage}
			totalPages={totalPages}
			hasPreviousPage={currentPage > 1}
			hasNextPage={currentPage < totalPages}
			onPreviousPage={() => goToPage(currentPage - 1)}
			onNextPage={() => goToPage(currentPage + 1)}
    	/>
    )}
  	</div>
	);

}

export default StarshipPage;
