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
	const [searchParams, setSearchParams] = useSearchParams();

	const page = parseInt(searchParams.get("page") || "1");
	const query = searchParams.get("query") || "";
	const peoplePerPage = 10;

	useEffect(() => {
		const fetchAllPeople = async () => {
			setIsLoading(true);
			setError(null);

			try {
				const res = await getPersonList(1, query);
				let results = [...res.data];
				const total = res.last_page;

				const promises = [];
				for (let p = 2; p <= total; p++) {
					promises.push(getPersonList(p, query));
				}
				const others = await Promise.all(promises);
				others.forEach((res) => {
					results = results.concat(res.data);
				});

				setPeople(results);
			} catch (err: unknown) {
				setError(err instanceof Error 
					? err.message 
					: "Failed to load people");
			}

			setIsLoading(false);
		};

		fetchAllPeople();
	}, [query]);

	const totalPages = Math.ceil(people.length / peoplePerPage);
	const startIndex = (page - 1) * peoplePerPage;
	const visiblePeople = people.slice(startIndex, startIndex + peoplePerPage);

	const goToPage = (newPage: number) => {
		const params: Record<string, string> = { page: newPage.toString() };
		if (query) params.query = query;
		setSearchParams(params);
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

			{!isLoading && !error && visiblePeople.length > 0 && (
				<ul className="people-list">
					{visiblePeople.map((person) => {
						const saberColor = lightsaberColor[person.id];
						const glowColor = saberColor ?? "#cccccc";
						const glowTransparent = saberColor
							? getTransparentColor(saberColor)
							: "rgba(204, 204, 204, 0.3)";

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
