import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getSpeciesById } from "../../services/StarwarsPediaAPI";
import type { Species } from "../../services/StarwarsPedia.types";
import LoadingGif from "../../components/LoadingGif";
import speciesImages from "../../data/SpeciesImages";
import "../../CSS/DetailsPage/SpeciesDetailsPage.css";

const SpeciesDetailsPage = () => {
	const { id } = useParams<{ id: string }>();
	const [species, setSpecies] = useState<Species | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchSpeciesData = async () => {
			setIsLoading(true);
			setError(null);
			try {
				const res = await getSpeciesById(Number(id));
				await new Promise(r => setTimeout(r, 1500));
				setSpecies(res);
			} catch (err) {
				setError(err instanceof Error 
					? err.message 
					: "Failed to load species");
			}
			setIsLoading(false);
		};
		if (id) fetchSpeciesData();
	}, [id]);

	if (isLoading) return <LoadingGif />;
	if (error) return <p className="error-msg">{error}</p>;
	if (!species) return null;

	return (
		<div className="species-details-page">
			<img
				src={speciesImages[species.id] ?? "/images/placeholder.png"}
				alt={species.name}
				className="species-details-img"
			/>

			<div className="species-details-info">
				<div className="species-details-header">
					<h1>{species.name}</h1>
					<button className="back-button" onClick={() => navigate(-1)}>
						← Back
					</button>
				</div>

				<p><strong>Classification:</strong> {species.classification}</p>
				<p><strong>Designation:</strong> {species.designation}</p>
				<p><strong>Average Height:</strong> {species.average_height} cm</p>
				<p><strong>Average Lifespan:</strong> {species.average_lifespan} years</p>
				<p><strong>Skin Colors:</strong> {species.skin_colors}</p>
				<p><strong>Hair Colors:</strong> {species.hair_colors}</p>
				<p><strong>Eye Colors:</strong> {species.eye_colors}</p>
				<p><strong>Language:</strong> {species.language}</p>
				<p><strong>Homeworld:</strong> {species.homeworld?.name ?? "Unknown"}</p>
			</div>
		</div>
	);
};

export default SpeciesDetailsPage;
