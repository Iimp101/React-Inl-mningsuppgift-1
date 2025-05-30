import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getStarshipById } from "../../services/StarwarsPediaAPI";
import type { Starship } from "../../services/StarwarsPedia.types";
import LoadingGif from "../../components/LoadingGif";
import RelatedLinksSection from "../../components/RelationLinkSection";
import starshipImages from "../../data/StarshipImages";
import "../../CSS/DetailsPage/StarshipDetailsPage.css";

const StarshipDetailsPage = () => {
	const { id } = useParams<{ id: string }>();
	const [starship, setStarship] = useState<Starship | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchStarshipData = async () => {
			setIsLoading(true);
			setError(null);

			try {
				const res = await getStarshipById(Number(id));
				await new Promise((r) => setTimeout(r, 1500));
				setStarship(res);
			} catch (err) {
				setError(err instanceof Error 
					? err.message 
					: "Failed to load starship");
			}

			setIsLoading(false);
		};

		if (id) fetchStarshipData();
	}, [id]);

	if (isLoading) return <LoadingGif />;
	if (error) return <p className="error-msg">{error}</p>;
	if (!starship) return null;

	return (
		<div className="starship-details-page">
			<div className="starship-image-wrapper">
				<img
					src={starshipImages[starship.id] ?? "/images/placeholder.png"}
					alt={starship.name}
					className="starship-details-img"
				/>
			</div>

			<div className="starship-details-info">
				<div className="starship-details-header">
					<h1>{starship.name}</h1>
					<button className="back-button" onClick={() => navigate(-1)}>
						← Back
					</button>
				</div>

				<p><strong>Model:</strong> {starship.model}</p>
				<p><strong>Manufacturer:</strong> {starship.manufacturer}</p>
				<p><strong>Cost:</strong> {starship.cost_in_credits} credits</p>
				<p><strong>Length:</strong> {starship.length} m</p>
				<p><strong>Crew:</strong> {starship.crew}</p>
				<p><strong>Passengers:</strong> {starship.passengers}</p>
				<p><strong>Max Speed:</strong> {starship.max_atmosphering_speed}</p>
				<p><strong>Hyperdrive Rating:</strong> {starship.hyperdrive_rating}</p>
				<p><strong>Starship Class:</strong> {starship.starship_class}</p>

				<div className="details-section">
					<RelatedLinksSection
						title="Films"
						items={starship.films}
						basePath="films"
						icon="🎬"
					/>
				</div>
			</div>
		</div>
	);
};

export default StarshipDetailsPage;
