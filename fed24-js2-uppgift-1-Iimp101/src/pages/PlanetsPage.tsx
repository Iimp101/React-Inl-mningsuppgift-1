import { useEffect, useState } from "react";
import { getPlanetList } from "../services/StarwarsPediaAPI";
import type { Planet, SWAPIListResponse } from "../services/StarwarsPedia.types";
import LoadingPagesGif from "../components/LoadingPagesGif";
import "../CSS/PlanetPage.css";


const PlanetsPage = () => {
	const [planets, setPlanets] = useState<Planet[]>([]);
	const [isLoading, setIsLoading] = useState(false);
  	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
    const fetchPlanets = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response: SWAPIListResponse<Planet> = await getPlanetList();
        await new Promise(r => setTimeout(r, 1500)); 
        setPlanets(response.data);
      } catch (err) {
        setError(err instanceof Error
			? err.message
			: "Failed to load planets"
			)
      }

      setIsLoading(false);
    };

    fetchPlanets();
  }, []);


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
    </div>
  )
}

export default PlanetsPage;
