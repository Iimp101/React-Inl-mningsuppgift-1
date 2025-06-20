import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { getSpeciesList } from "../services/StarwarsPediaAPI";
import type { Species } from "../services/StarwarsPedia.types";
import LoadingGif from "../components/LoadingGif";
import Pagination from "../components/Pagination";
import speciesImages from "../data/SpeciesImages";
import speciesDescriptions from "../data/speciesDescriptions";
import "../CSS/SpeciesPage.css";

const SpeciesPage = () => {
	const [species, setSpecies] = useState<Species[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [searchParams, setSearchParams] = useSearchParams();

	const page = parseInt(searchParams.get("page") || "1");
	const query = searchParams.get("query") || "";
	const speciesPerPage = 8;

	useEffect(() => {
		const fetchAllSpecies = async () => {
			setIsLoading(true);
			setError(null);

			try {
				const res = await getSpeciesList(1, query);
				await new Promise(r => setTimeout(r, 1500));
				let results = [...res.data];
				const total = res.last_page;

				const promises = [];
				for (let p = 2; p <= total; p++) {
					promises.push(getSpeciesList(p, query));
				}
				const others = await Promise.all(promises);
				others.forEach(res => results = results.concat(res.data));

				setSpecies(results);
			} catch (err) {
				setError(err instanceof Error 
					? err.message 
					: "Failed to load species");
			}

			setIsLoading(false);
		};

		fetchAllSpecies();
	}, [query]);

	const totalPages = Math.ceil(species.length / speciesPerPage);
	const startIndex = (page - 1) * speciesPerPage;
	const visibleSpecies = species.slice(startIndex, startIndex + speciesPerPage);

	const goToPage = (newPage: number) => {
		const newParams: Record<string, string> = { page: newPage.toString() };
		if (query) newParams.query = query;
		setSearchParams(newParams);
	};

	return (
		<div className="species-page">
			<h1 className="page-title">				
				Star Wars Species			
			</h1>

			{query && <h2 className="search-results-heading">Search results for "{query}"</h2>}

			{isLoading && <LoadingGif />}
			{error && <p className="error-msg">{error}</p>}

			{!isLoading && !error && visibleSpecies.length > 0 && (
				<ul className="species-list">
					{visibleSpecies.map((specie) => (
						<li key={specie.id}>
							<Link to={`/species/${specie.id}`} className="species-card-link">
								<div className="species-card">
									<img src={speciesImages[specie.id]} alt={specie.name} className="species-image"/>
									<div className="species-info">
										<h3>{specie.name}</h3>
										<p className="species-description">
    										{speciesDescriptions[specie.name]}
  										</p>
									</div>
								</div>
							</Link>
						</li>
					))}
				</ul>
			)}

			{!isLoading && !error && species.length > 0 && (
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

			{!isLoading && !error && species.length === 0 && (
				<p className="no-results-msg">No results found for "{query}"</p>
			)}
		</div>
	);
};

export default SpeciesPage;
