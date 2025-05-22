import { useEffect, useState } from "react";
import { getPlanetList } from "../services/StarwarsPediaAPI";
import type { Planet, SWAPIListResponse } from "../services/StarwarsPedia.types";
import { useSearchParams } from "react-router-dom";
import LoadingPagesGif from "../components/LoadingPagesGif";
import Pagination from "../components/Pagination";
import planetImages from "../data/PlanetImages";
import "../CSS/PlanetPage.css";


const PlanetsPage = () => {
	const [planets, setPlanets] = useState<Planet[]>([]);
	const [isLoading, setIsLoading] = useState(false);
  	const [error, setError] = useState<string | null>(null);
	const [totalPages, setTotalPages] = useState<number>(1);
	const [searchParams, setSearchParams] = useSearchParams();

	const currentPage = parseInt(searchParams.get("page") || "1");

	useEffect(() => {
    const fetchPlanets = async () => {
      setIsLoading(true);
      setError(null);

      try {
			const response: SWAPIListResponse<Planet> = await getPlanetList(currentPage);
			await new Promise(r => setTimeout(r, 1500)); 
			setPlanets(response.data);
			setTotalPages(response.last_page);
      } catch (err) {
        setError(err instanceof Error
			? err.message
			: "Failed to load planets"
			)
      	}

    	setIsLoading(false);
    };

    fetchPlanets();
}, [currentPage]);

	const goToPage = (newPage: number) => {
  		setSearchParams({ page: newPage.toString() });
	};

	return (
    	<div className="planets-page">
      		<h1 className="page-title with-lightsabers">
				<img
					src="/GIFS/lightsaberBlue2.gif"
					alt="Blue Lightsaber"
					className="lightsaber left"
				/>
				Starwars Planets
				<img
					src="/GIFS/lightsaberRed2.gif"
					alt="Red Lightsaber"
					className="lightsaber right"
				/>
			</h1>

    	{isLoading && <LoadingPagesGif />}
    	{error && <p className="error-msg">{error}</p>}

      	{!isLoading && !error && (
        	<ul className="planet-list">
			{planets.map((planet) => (
				<li key={planet.id} className="planet-card">
					<img
						src={planetImages[planet.id]}
						alt={planet.name}
						className="planet-image"
						/>
				<div className="planet-info">
					<h3>{planet.name}</h3>
					<p><strong>Climate:</strong> {planet.climate}</p>
					<p><strong>Terrain:</strong> {planet.terrain}</p>
					<p><strong>Population:</strong> {planet.population}</p>
					<p><strong>Gravity:</strong> {planet.gravity}</p>
				</div>
				</li>
          	))}
        </ul>
      )}

	  {!isLoading && !error && planets.length > 0 && (
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
	)
}

export default PlanetsPage;
