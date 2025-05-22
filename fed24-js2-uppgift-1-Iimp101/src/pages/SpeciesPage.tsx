import { useState, useEffect } from "react";
import { getSpeciesList } from "../services/StarwarsPediaAPI";
import type { Species, SWAPIListResponse } from "../services/StarwarsPedia.types";
import { useSearchParams } from "react-router-dom";
import LoadingPagesGif from "../components/LoadingPagesGif";
import Pagination from "../components/Pagination";
import "../CSS/SpeciesPage.css";

const SpeciesPage = () => {

	const [species, setSpecies] = useState<Species[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [totalPages, setTotalPages] = useState<number>(1);
	const [searchParams, setSearchParams] = useSearchParams();

	const currentPage = parseInt(searchParams.get("page") || "1");

	useEffect(() => {
		const fetchSpecies = async () => {
			setIsLoading(true);
			setError(null);

			try {
				const response: SWAPIListResponse<Species> = await getSpeciesList(currentPage);
				await new Promise(r => setTimeout(r, 1500)); 
				setSpecies(response.data);
				setTotalPages(response.last_page);
			}
			catch (err) {
			setError(err instanceof Error
				? err.message
				: "Failed to load species"
				)
			}

			setIsLoading(false);
		};

		fetchSpecies();
	}, [currentPage]);

	const goToPage = (newPage: number) => {
		setSearchParams( {page: newPage.toString() });
	};

	return (
		<div className="species-page">
			<h1 className="page-title with-lightsabers">
				<img
					src="/GIFS/lightsaberBlue2.gif"
					alt="Blue Lightsaber"
					className="lightsaber left"
				/>
				Starwars Species
				<img
					src="/GIFS/lightsaberRed2.gif"
					alt="Red Lightsaber"
					className="lightsaber right"
				/>
			</h1>

			{isLoading && <LoadingPagesGif />}
			{error && <p className="error-msg">{error}</p>}

			{!isLoading && !error && (
				<ul className="species-list">
					{species.map((specie) => (
						<li key={specie.id} className="species-card">
							{/* <img
								src={speciesImages[specie.id]}
								alt={specie.name}
               					 className="species-image"
              				/> */}
							<div className="species-info">
								<h3>{specie.name}</h3>
								<p><strong>Classification:</strong> {specie.classification}</p>
								<p><strong>Designation:</strong> {specie.designation}</p>
								<p><strong>Avg Height:</strong> {specie.average_height} cm</p>
								<p><strong>Lifespan:</strong> {specie.average_lifespan} years</p>
								<p><strong>Language:</strong> {specie.language}</p>
								{specie.homeworld && (
								<p><strong>Homeworld:</strong> {specie.homeworld.name}</p>
                				)}
              				</div>
						</li>
					))}
				</ul>
			)}

			{!isLoading && !error && species.length > 0 && (
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

export default SpeciesPage;
