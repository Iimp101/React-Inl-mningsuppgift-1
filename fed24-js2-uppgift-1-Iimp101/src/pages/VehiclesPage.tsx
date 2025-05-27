import { useEffect, useState } from "react";
import { getVehicleList } from "../services/StarwarsPediaAPI";
import type { Vehicle } from "../services/StarwarsPedia.types";
import { useSearchParams, Link } from "react-router-dom";
import LoadingPagesGif from "../components/LoadingPagesGif";
import Pagination from "../components/Pagination";
import "../CSS/VehiclePage.css";
import vehicleImages from "../data/VehicleImages";

const VehiclesPage = () => {
	const [vehicles, setVehicles] = useState<Vehicle[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [searchParams, setSearchParams] = useSearchParams();

	const currentPage = parseInt(searchParams.get("page") || "1");
	const vehiclesPerPage = 8;

	useEffect(() => {
		const fetchVehicles = async () => {
			setIsLoading(true);
			setError(null);

			try {
				const firstPage = await getVehicleList(1);
				let allResults = [...firstPage.data];

				const totalPages = firstPage.last_page;
				const promises = [];

				for (let page = 2; page <= totalPages; page++) {
					promises.push(getVehicleList(page));
				}

				const otherPages = await Promise.all(promises);
				otherPages.forEach(p => {
					allResults = allResults.concat(p.data);
				});

				setVehicles(allResults);
			} catch (err) {
				setError(err instanceof Error 
					? err.message 
					: "Failed to load vehicles");
			}

			setIsLoading(false);
		};

		fetchVehicles();
	}, [currentPage]);

	const totalPages = Math.ceil(vehicles.length / vehiclesPerPage);
	const startIndex = (currentPage - 1) * vehiclesPerPage;
	const visibleVehicles = vehicles.slice(startIndex, startIndex + vehiclesPerPage);

	const goToPage = (newPage: number) => {
		setSearchParams({ page: newPage.toString() });
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

			{isLoading && <LoadingPagesGif />}
			{error && <p className="error-msg">{error}</p>}

			{!isLoading && !error && (
				<ul className="vehicle-list">
					{visibleVehicles.map(vehicle => (
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

			{!isLoading && !error && visibleVehicles.length > 0 && (
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

export default VehiclesPage;
