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
	const [searchParams, setSearchParams] = useSearchParams();

	const page = parseInt(searchParams.get("page") || "1");
	const query = searchParams.get("query") || "";
	const planetsPerPage = 8;

	useEffect(() => {
		const fetchAllPlanets = async () => {
			setIsLoading(true);
			setError(null);

			try {
				const res = await getPlanetList(1, query);
				await new Promise(r => setTimeout(r, 1500));
				console.log("API returned:", res.data);
				let results = [...res.data];
				const total = res.last_page;

				const promises = [];
				for (let p = 2; p <= total; p++) {
					promises.push(getPlanetList(p, query));
				}

				const others = await Promise.all(promises);
				others.forEach(res => results = results.concat(res.data));

				setPlanets(results);
			} catch (err: unknown) {
				setError(err instanceof Error 
					? err.message 
					: "Failed to load planets");
			}

			setIsLoading(false);
		};

		fetchAllPlanets();
	}, [query]);

	const totalPages = Math.ceil(planets.length / planetsPerPage);
	const startIndex = (page - 1) * planetsPerPage;
	const visiblePlanets = planets.slice(startIndex, startIndex + planetsPerPage);

	const goToPage = (newPage: number) => {
		const newParams: Record<string, string> = { page: newPage.toString() };
		if (query) newParams.query = query;
		setSearchParams(newParams);
	};

	return (
		<div className="planets-page">
			<h1 className="page-title">
				Star Wars Planets
			</h1>

			{query && <h2 className="search-results-heading">Search results for "{query}"</h2>}

			{isLoading && <LoadingGif />}
			{error && <p className="error-msg">{error}</p>}

			{!isLoading && !error && visiblePlanets.length > 0 && (
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
										<img src={planetImages[planet.id]} alt={planet.name} className="planet-image" />
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
