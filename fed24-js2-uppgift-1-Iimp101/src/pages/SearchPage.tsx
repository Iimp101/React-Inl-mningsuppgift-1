import { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import {
	getFilmList,
	getPersonList,
	getPlanetList,
	getSpeciesList,
	getStarshipList,
	getVehicleList,
} from "../services/StarwarsPediaAPI";
import type {
	Film,
	Person,
	Planet,
	Species,
	Starship,
	Vehicle,
} from "../services/StarwarsPedia.types";
import Pagination from "../components/Pagination";
import LoadingPagesGif from "../components/LoadingPagesGif";

const SearchPage = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const navigate = useNavigate();

	const query = searchParams.get("query") || "";
	const currentPage = Number(searchParams.get("page")) || 1;

	const [films, setFilms] = useState<Film[]>([]);
	const [people, setPeople] = useState<Person[]>([]);
	const [planets, setPlanets] = useState<Planet[]>([]);
	const [species, setSpecies] = useState<Species[]>([]);
	const [starships, setStarships] = useState<Starship[]>([]);
	const [vehicles, setVehicles] = useState<Vehicle[]>([]);

	const [totalFilms, setTotalFilms] = useState(0);
	const [totalPeople, setTotalPeople] = useState(0);
	const [totalPlanets, setTotalPlanets] = useState(0);
	const [totalSpecies, setTotalSpecies] = useState(0);
	const [totalStarships, setTotalStarships] = useState(0);
	const [totalVehicles, setTotalVehicles] = useState(0);

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [noResults, setNoResults] = useState(false);
	const [redirecting, setRedirecting] = useState(false);

	useEffect(() => {
		if (query.trim().length < 2) return;

		const fetchAll = async () => {
			setLoading(true);
			setError(null);
			setNoResults(false);

			try {
				const [
					filmsRes,
					peopleRes,
					planetsRes,
					speciesRes,
					starshipsRes,
					vehiclesRes,
				] = await Promise.all([
					getFilmList(currentPage, query),
					getPersonList(currentPage, query),
					getPlanetList(currentPage, query),
					getSpeciesList(currentPage, query),
					getStarshipList(currentPage, query),
					getVehicleList(currentPage, query),
				]);

				setFilms(filmsRes.data);
				setTotalFilms(filmsRes.total);

				setPeople(peopleRes.data);
				setTotalPeople(peopleRes.total);

				setPlanets(planetsRes.data);
				setTotalPlanets(planetsRes.total);

				setSpecies(speciesRes.data);
				setTotalSpecies(speciesRes.total);

				setStarships(starshipsRes.data);
				setTotalStarships(starshipsRes.total);

				setVehicles(vehiclesRes.data);
				setTotalVehicles(vehiclesRes.total);

				const allResultsTotal =
					filmsRes.total +
					peopleRes.total +
					planetsRes.total +
					speciesRes.total +
					starshipsRes.total +
					vehiclesRes.total;

				if (allResultsTotal === 0) {
					setNoResults(true);
					return;
				}

				if (allResultsTotal === 1) {
					setRedirecting(true);
					if (filmsRes.total === 1) return navigate(`/films/${filmsRes.data[0].id}`);
					if (peopleRes.total === 1) return navigate(`/people/${peopleRes.data[0].id}`);
					if (planetsRes.total === 1) return navigate(`/planets/${planetsRes.data[0].id}`);
					if (speciesRes.total === 1) return navigate(`/species/${speciesRes.data[0].id}`);
					if (starshipsRes.total === 1) return navigate(`/starships/${starshipsRes.data[0].id}`);
					if (vehiclesRes.total === 1) return navigate(`/vehicles/${vehiclesRes.data[0].id}`);
				}
			} catch (err) {
				setError(err instanceof Error 
                    ? err.message 
                    : "Failed to load your request");
			} 
			setLoading(false);
		};

		fetchAll();
	}, [query, currentPage, navigate]);

	const goToPage = (page: number) => {
		setSearchParams({ query, page: page.toString() });
	};

	const renderCategory = <T extends { id: number; name?: string; title?: string; image_url?: string | null }>(
		title: string,
		items: T[],
		basePath: string,
		totalItems: number
	) => {
		if (items.length === 0) return null;

		const itemsPerPage = 10;
		const totalPages = Math.ceil(totalItems / itemsPerPage);

		return (
			<div className="search-category">
				<h2>{title}</h2>
				<ul className="search-result-list">
					{items.map((item) => (
						<li key={item.id}>
							<Link to={`/${basePath}/${item.id}`} className="search-result-card">
								<img
									src={item.image_url ?? "/images/placeholder.png"}
									alt={item.title || item.name}
									className="search-result-image"
								/>
								<p>{item.title || item.name}</p>
							</Link>
						</li>
					))}
				</ul>

				{totalPages > 1 && (
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
		);
	};

	if (redirecting) {
		return null;
	}

	if (loading) {
		return (
			<div className="search-page">
				<LoadingPagesGif />
			</div>
		);
	}

	return (
		<div className="search-page">
			{error && <p className="error-msg">{error}</p>}

			{noResults ? (
				<p className="no-results-msg">
					❌ No results found for "{query}" in the Star Wars database.
				</p>
			) : (
				<>
					<h1 className="page-title">Search Results for "{query}"</h1>
					{renderCategory("Films", films, "films", totalFilms)}
					{renderCategory("People", people, "people", totalPeople)}
					{renderCategory("Planets", planets, "planets", totalPlanets)}
					{renderCategory("Species", species, "species", totalSpecies)}
					{renderCategory("Starships", starships, "starships", totalStarships)}
					{renderCategory("Vehicles", vehicles, "vehicles", totalVehicles)}
				</>
			)}
		</div>
	);
};

export default SearchPage;
