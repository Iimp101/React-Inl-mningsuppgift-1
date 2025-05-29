import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { getVehicleList } from "../services/StarwarsPediaAPI";
import type { Vehicle } from "../services/StarwarsPedia.types";
import LoadingGif from "../components/LoadingGif";
import Pagination from "../components/Pagination";
import "../CSS/VehiclePage.css";
import vehicleImages from "../data/VehicleImages";

const VehiclesPage = () => {
	const [vehicles, setVehicles] = useState<Vehicle[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [totalPages, setTotalPages] = useState(1);

	const [searchParams, setSearchParams] = useSearchParams();
	const page = parseInt(searchParams.get("page") || "1");
	const query = searchParams.get("query") || "";

	useEffect(() => {
		const fetchVehicles = async () => {
			setIsLoading(true);
			setError(null);

			try {
				const response = await getVehicleList(page, query);
				setVehicles(response.data);
				setTotalPages(response.last_page);
			} catch (err) {
				setError(err instanceof Error 
					? err.message 
					: "Failed to load vehicles");
			}

			setIsLoading(false);
		};

		fetchVehicles();
	}, [page, query]);

	const goToPage = (newPage: number) => {
		const newParams: Record<string, string> = { page: newPage.toString() };
		if (query) newParams.query = query;
		setSearchParams(newParams);
	};

	return (
		<div className="vehicles-page">
			<h1 className="page-title with-lightsabers">
				<img
					src="/GIFS/lightsaberBlue2.gif"
					alt="Blue Lightsaber"
					className="lightsaber left"
				/>
				Star wars Vehicles
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

			{!isLoading && !error && vehicles.length > 0 && (
				<ul className="vehicle-list">
					{vehicles.map(vehicle => (
						<li key={vehicle.id}>
							<Link to={`/vehicles/${vehicle.id}`} className="vehicle-card-link">
								<div className="vehicle-card">
									<img
										src={vehicleImages[vehicle.id]}
										alt={vehicle.name}
										className="vehicle-image"
									/>
									<div className="vehicle-info">
										<h3>{vehicle.name}</h3>
										<p><strong>Model:</strong> {vehicle.model}</p>
										<p><strong>Class:</strong> {vehicle.vehicle_class}</p>
										<p><strong>Manufacturer:</strong> {vehicle.manufacturer}</p>
										<p><strong>Cost:</strong> {vehicle.cost_in_credits} credits</p>
										<p><strong>Crew:</strong> {vehicle.crew}</p>
										<p><strong>Max Speed:</strong> {vehicle.max_atmosphering_speed} km/h</p>
										<p><strong>Films:</strong> {vehicle.films_count}</p>
									</div>
								</div>
							</Link>
						</li>
					))}
				</ul>
			)}

			{!isLoading && !error && vehicles.length > 0 && (
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

			{!isLoading && !error && vehicles.length === 0 && (
				<p className="no-results-msg">No results found for "{query}"</p>
			)}
		</div>
	);
};

export default VehiclesPage;
