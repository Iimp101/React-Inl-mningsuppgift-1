import { useEffect, useState } from "react";
import { getVehicleList } from "../services/StarwarsPediaAPI";
import type { Vehicle } from "../services/StarwarsPedia.types";
import { useSearchParams, Link } from "react-router-dom";
import LoadingGif from "../components/LoadingGif";
import Pagination from "../components/Pagination";
import vehicleImages from "../data/VehicleImages";
import "../CSS/VehiclePage.css";
import vehicleDescriptions from "../data/vehicleDescriptions";

const VehiclesPage = () => {
	const [vehicles, setVehicles] = useState<Vehicle[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [searchParams, setSearchParams] = useSearchParams();

	const page = parseInt(searchParams.get("page") || "1");
	const query = searchParams.get("query") || "";
	const vehiclesPerPage = 8;

	useEffect(() => {
		const fetchAllVehicles = async () => {
			setIsLoading(true);
			setError(null);

			try {
				const res = await getVehicleList(1, query);
				await new Promise(r => setTimeout(r, 1500));
				let results = [...res.data];
				const total = res.last_page;

				const promises = [];
				for (let p = 2; p <= total; p++) {
					promises.push(getVehicleList(p, query));
				}
				const others = await Promise.all(promises);
				others.forEach(res => results = results.concat(res.data));

				setVehicles(results);
			} catch (err: unknown) {
				setError(err instanceof Error 
					? err.message 
					: "Failed to load vehicles");
			}

			setIsLoading(false);
		};

		fetchAllVehicles();
	}, [query]);

	const totalPages = Math.ceil(vehicles.length / vehiclesPerPage);
	const startIndex = (page - 1) * vehiclesPerPage;
	const visibleVehicles = vehicles.slice(startIndex, startIndex + vehiclesPerPage);

	const goToPage = (newPage: number) => {
		const newParams: Record<string, string> = { page: newPage.toString() };
		if (query) newParams.query = query;
		setSearchParams(newParams);
	};

	return (
		<div className="vehicles-page">
			<h1 className="page-title">
				Star Wars Vehicles
			</h1>

			{query && <h2 className="search-results-heading">Search results for "{query}"</h2>}

			{isLoading && <LoadingGif />}
			{error && <p className="error-msg">{error}</p>}

			{!isLoading && !error && visibleVehicles.length > 0 && (
				<ul className={`vehicle-list ${visibleVehicles.length === 1 ? "centered" : ""}`}>
					{visibleVehicles.map(vehicle => (
						<li key={vehicle.id}>
							<Link to={`/vehicles/${vehicle.id}`} className="vehicle-card-link">
								<div className="vehicle-card">
									<img src={vehicleImages[vehicle.id]} alt={vehicle.name} className="vehicle-image" />
									<div className="vehicle-info">
										<h3>{vehicle.name}</h3>
										<p className="vehicle-description">
    										{vehicleDescriptions[vehicle.name]}
  										</p>
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
