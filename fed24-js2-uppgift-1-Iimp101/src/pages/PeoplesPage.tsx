import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getPersonList } from "../services/StarwarsPediaAPI";
import type { Person, SWAPIListResponse } from "../services/StarwarsPedia.types";
import Pagination from "../components/Pagination";
import LoadingPagesGif from "../components/LoadingPagesGif";
import missingImages from "../data/PeopleImages";
import "../CSS/PeoplesPage.css";

const PeoplesPage = () => {
	const [people, setPeople] = useState<Person[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [totalPages, setTotalPages] = useState<number>(1);
	const [searchParams, setSearchParams] = useSearchParams();

	const currentPage = parseInt(searchParams.get("page") || "1");

	useEffect(() => {
		const fetchPeople = async () => {
			setIsLoading(true);
			setError(null);

			try {
				const data: SWAPIListResponse<Person> = await getPersonList(currentPage);
				await new Promise(r => setTimeout(r, 1500));
				setPeople(data.data);
				setTotalPages(data.last_page);
			} catch (err) {
				setError(err instanceof Error
				? err.message
				: "Failed to load people"
				)
			}
			setIsLoading(false);
		};

		fetchPeople();
	}, [currentPage]);


	const goToPage = (newPage: number) => {
		setSearchParams({ page: newPage.toString() });
	};

	return (
		<div className="people-page">
			<h1 className="page-title with-lightsabers">
				<img
					src="/GIFS/lightsaberBlue2.gif"
					alt="Blue Lightsaber"
					className="lightsaber left"
				/>
				Starwars People
				<img
					src="/GIFS/lightsaberRed2.gif"
					alt="Red Lightsaber"
					className="lightsaber right"
				/>
			</h1>


			{isLoading && <LoadingPagesGif />}
			{error && <p className="error-msg">{error}</p>}

			{!isLoading && !error && people.length > 0 && (
				<ul className="people-list">
					{people.map((person) => (
						<li key={person.id} className="person-card">
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
						</li>
					))}
				</ul>
			)}

			{!isLoading && !error && people.length > 0 && (
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

export default PeoplesPage;
