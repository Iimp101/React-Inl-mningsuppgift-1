import { useEffect, useState } from "react";
import { getPlanetList } from "../services/StarwarsPediaAPI";
import type { Planet } from "../services/StarwarsPedia.types";
import { useSearchParams, Link } from "react-router-dom";
import LoadingPagesGif from "../components/LoadingPagesGif";
import Pagination from "../components/Pagination";
import planetImages from "../data/PlanetImages";
import lightsaberColor from "../data/PeopleLightsaverColor";
import getTransparentColor from "../components/TransparentColor";
import "../CSS/PlanetPage.css";

const PlanetsPage = () => {
	const [planets, setPlanets] = useState<Planet[]>([]);
	const [isLoading, setIsLoading] = useState(false);
  	const [error, setError] = useState<string | null>(null);
	const [searchParams, setSearchParams] = useSearchParams();

	const currentPage = parseInt(searchParams.get("page") || "1");
	const planetPerPage = 8;


	useEffect(() => {
    const fetchPlanets = async () => {
      setIsLoading(true);
      setError(null);

      try {
			const firstPage = await getPlanetList(1);
			let allResults = [...firstPage.data];

			const totalPages = firstPage.last_page;
			const promises = [];

			for (let page = 2; page <= totalPages; page++) {
				promises.push(getPlanetList(page));
			}

			const otherPages = await Promise.all(promises);
			otherPages.forEach(p => allResults = allResults.concat(p.data));

			setPlanets(allResults);
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

	const totalPages = Math.ceil(planets.length / planetPerPage);
	const startIndex = (currentPage - 1) * planetPerPage;
	const visiblePlanets = planets.slice(startIndex, startIndex + planetPerPage);

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
				Star wars Planets
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
				{visiblePlanets.map((planet) => {
				const saberColor = lightsaberColor[planet.id];
				const glowColor = saberColor ?? "#cccccc";
				const glowTransparent = saberColor
					? getTransparentColor(saberColor)
					: "rgba(204, 204, 204, 0.3)";

				return (
					<li key={planet.id}>
					<Link to={`/planets/${planet.id}`} className="planet-card-link">
						<div
						className="planet-card"
						style={{
							"--glow-color": glowColor,
							"--glow-color-transparent": glowTransparent
						} as React.CSSProperties}
						>
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
						</div>
					</Link>
					</li>
					);
				})}
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
					onFirstPage={() => goToPage(1)}
					onLastPage={() => goToPage(totalPages)}
				/>
			)}
		</div>
)	;
};

export default PlanetsPage;
