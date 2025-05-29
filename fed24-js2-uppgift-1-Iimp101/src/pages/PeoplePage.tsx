import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { getPersonList } from "../services/StarwarsPediaAPI";
import type { Person } from "../services/StarwarsPedia.types";
import Pagination from "../components/Pagination";
import LoadingGif from "../components/LoadingGif";
import missingImages from "../data/PeopleImages";
import lightsaberColor from "../data/PeopleLightsaverColor";
import getTransparentColor from "../components/TransparentColor";
import "../CSS/PeoplesPage.css";

const PeoplePage = () => {
	const [people, setPeople] = useState<Person[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [totalPages, setTotalPages] = useState(1);
	const [searchParams, setSearchParams] = useSearchParams();

	const page = parseInt(searchParams.get("page") || "1");
	const query = searchParams.get("query") || "";

	useEffect(() => {
		const fetchPeople = async () => {
			setIsLoading(true);
			setError(null);

			try {
				const response = await getPersonList(page, query);
				setPeople(response.data);
				setTotalPages(response.last_page);
			} catch (err) {
				setError(err instanceof Error
				? err.message
				: "Failed to load people");
			}
			setIsLoading(false);
		};

		fetchPeople();
	}, [page, query]);

	const goToPage = (newPage: number) => {
		const newParams: Record<string, string> = { page: newPage.toString() };
		if (query) newParams.query = query;
		setSearchParams(newParams);
	};

	return (
		<div className="people-page">
			<h1 className="page-title with-lightsabers">
				<img
					src="/GIFS/lightsaberBlue2.gif"
					alt="Blue Lightsaber"
					className="lightsaber left"
				/>
				Star wars People
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

			{!isLoading && !error && people.length > 0 && (
				<ul className="people-list">
					{people.map((person) => {
						const saberColor = lightsaberColor[person.id];
						const glowColor = saberColor ?? "#cccccc";
						const glowTransparent = saberColor ? getTransparentColor(saberColor) : "rgba(204, 204, 204, 0.3)";

						return (
							<li key={person.id}>
								<Link to={`/people/${person.id}`} className="person-card-link">
									<div
										className="person-card"
										style={{
											"--glow-color": glowColor,
											"--glow-color-transparent": glowTransparent
										} as React.CSSProperties}
									>
										<img
											src={person.image_url || missingImages[person.id]}
											alt={person.name}
											className="person-image"
										/>
										<div className="person-info">
											<h3>{person.name}</h3>
											<p><strong>Birth Year:</strong> {person.birth_year}</p>
											<p><strong>Height:</strong> {person.height} cm</p>
											<p><strong>Mass:</strong> {person.mass} kg</p>
											<p><strong>Homeworld:</strong> {person.homeworld.name}</p>
										</div>
									</div>
								</Link>
							</li>
						);
					})}
				</ul>
			)}

			{!isLoading && !error && people.length > 0 && (
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

			{!isLoading && !error && people.length === 0 && (
				<p className="no-results-msg">No results found for "{query}"</p>
			)}
		</div>
	);
};

export default PeoplePage;
