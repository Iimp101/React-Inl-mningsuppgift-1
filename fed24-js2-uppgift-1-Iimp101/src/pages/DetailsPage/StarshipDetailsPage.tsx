import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getStarshipById } from "../../services/StarwarsPediaAPI";
import type { Starship } from "../../services/StarwarsPedia.types";
import LoadingPagesGif from "../../components/LoadingPagesGif";
import starshipImages from "../../data/StarshipImages";
import "../../CSS/DetailsPage/StarshipDetailsPage.css";

const StarshipDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const [starships, setStarships] = useState<Starship | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

	useEffect(() => {
		const fetchStarshipData = async () => {
			setIsLoading(true);
			setError(null);

			try {
				const res = await getStarshipById(Number(id));
				await new Promise(r => setTimeout(r, 1500));
				setStarships(res);
			}
			catch (err) {
				setError(err instanceof Error 
                ? err.message 
                : "Failed to load Starship");
			}
			setIsLoading(false);
		};
		if (id) fetchStarshipData();
	}, [id]);

	if (isLoading) return <LoadingPagesGif />;
	if (error) return <p className="error-msg">{error}</p>;
	if (!starships) return null;



  	return (

		<div className="starship-details-page">
			<div className="starship-image-wrapper">
				<img
					src={starshipImages[starships.id] ?? "/images/placeholder.png"}
					alt={starships.name}
					className="starship-details-img"
				/>
			</div>

			<div className="starship-details-info">
				<div className="starship-details-header">
					<h1>{starships.name}</h1>
					<button className="back-button" onClick={() => navigate(-1)}>
						← Back
					</button>
				</div>

				<p><strong>Model:</strong> {starships.model}</p>
				<p><strong>Manufacturer:</strong> {starships.manufacturer}</p>
				<p><strong>Cost:</strong> {starships.cost_in_credits} credits</p>
				<p><strong>Length:</strong> {starships.length} m</p>
				<p><strong>Crew:</strong> {starships.crew}</p>
				<p><strong>Passengers:</strong> {starships.passengers}</p>
				<p><strong>Max Speed:</strong> {starships.max_atmosphering_speed}</p>
				<p><strong>Hyperdrive Rating:</strong> {starships.hyperdrive_rating}</p>
				<p><strong>Starship Class:</strong> {starships.starship_class}</p>
				<p><strong>Films:</strong> {starships.films_count}</p>
			</div>
		</div>
	);
}

export default StarshipDetailsPage;
