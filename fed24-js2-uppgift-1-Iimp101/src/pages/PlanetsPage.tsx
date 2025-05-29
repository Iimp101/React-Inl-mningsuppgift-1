import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { getPlanetList } from "../services/StarwarsPediaAPI";
import type { Planet } from "../services/StarwarsPedia.types";
import LoadingGif from "../components/LoadingGif";
import Pagination from "../components/Pagination";
import planetImages from "../data/PlanetImages";
import lightsaberColor from "../data/PeopleLightsaverColor";
import getTransparentColor from "../components/TransparentColor";
import "../CSS/PlanetPage.css";

const PlanetsPage = () => {
	const [planets, setPlanets] = useState<Planet[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [totalPages, setTotalPages] = useState(1);

	const [searchParams, setSearchParams] = useSearchParams();
	const page = parseInt(searchParams.get("page") || "1");
	const query = searchParams.get("query") || "";

	useEffect(() => {
		const fetchPlanets = async () => {
			setIsLoading(true);
			setError(null);

			try {
				const response = await getPlanetList(page, query);
				setPlanets(response.data);
				setTotalPages(response.last_page);
			} catch (err) {
				setError(err instanceof Error 
					? err.message 
					: "Failed to load planets");
			}
			setIsLoading(false);
		};

		fetchPlanets();
	}, [page, query]);

	const goToPage = (newPage: number) => {
		const newParams: Record<string, string> = { page: newPage.toString() };
		if (query) newParams.query = query;
		setSearchParams(newParams);
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

			{query && (
				<h2 className="search-results-heading">
					Search results for "{query}"
				</h2>
			)}

			{isLoading && <LoadingGif />}
			{error && <p className="error-msg">{error}</p>}

			{!isLoading && !error && planets.length > 0 && (
				<ul className="planet-list">
					{planets.map((planet) => {
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

			{!isLoading && !error && planets.length === 0 && (
				<p className="no-results-msg">No results found for "{query}"</p>
			)}
		</div>
	);
};

export default PlanetsPage;
