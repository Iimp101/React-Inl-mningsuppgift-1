import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getVehicleById } from "../../services/StarwarsPediaAPI";
import type { Vehicle } from "../../services/StarwarsPedia.types";
import LoadingGif from "../../components/LoadingGif";
import RelatedLinksSection from "../../components/RelationLinkSection";
import vehicleImages from "../../data/VehicleImages";
import "../../CSS/DetailsPage/VehicleDetailsPage.css";

const VehicleDetailsPage = () => {
	const { id } = useParams<{ id: string }>();
	const [vehicle, setVehicle] = useState<Vehicle | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchVehicleData = async () => {
			setIsLoading(true);
			setError(null);

			try {
				const res = await getVehicleById(Number(id));
				await new Promise(r => setTimeout(r, 1500));
				setVehicle(res);
			} catch (err) {
				setError(err instanceof Error 
					? err.message 
					: "Failed to load vehicle");
			}

			setIsLoading(false);
		};

		if (id) fetchVehicleData();
	}, [id]);

	if (isLoading) return <LoadingGif />;
	if (error) return <p className="error-msg">{error}</p>;
	if (!vehicle) return null;

	return (
		<div className="vehicle-details-page">
			<div className="vehicle-image-wrapper">
				<img
					src={vehicleImages[vehicle.id] ?? "/images/placeholder.png"}
					alt={vehicle.name}
					className="vehicle-details-img"
				/>
			</div>

			<div className="vehicle-details-info">
				<div className="vehicle-details-header">
					<h1>{vehicle.name}</h1>
					<button className="back-button" onClick={() => navigate(-1)}>
						← Back
					</button>
				</div>

				<p><strong>Model:</strong> {vehicle.model}</p>
				<p><strong>Class:</strong> {vehicle.vehicle_class}</p>
				<p><strong>Manufacturer:</strong> {vehicle.manufacturer}</p>
				<p><strong>Cost:</strong> {vehicle.cost_in_credits} credits</p>
				<p><strong>Length:</strong> {vehicle.length} m</p>
				<p><strong>Crew:</strong> {vehicle.crew}</p>
				<p><strong>Passengers:</strong> {vehicle.passengers}</p>
				<p><strong>Max Speed:</strong> {vehicle.max_atmosphering_speed} km/h</p>
				<p><strong>Consumables:</strong> {vehicle.consumables}</p>

				<div className="details-section">
					<RelatedLinksSection
						title="Films"
						items={vehicle.films}
						basePath="films"
						icon="🎬"
					/>
				</div>
			</div>
		</div>
	);
};

export default VehicleDetailsPage;
