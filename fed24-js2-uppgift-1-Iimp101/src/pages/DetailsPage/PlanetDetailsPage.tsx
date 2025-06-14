import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPlanetById } from "../../services/StarwarsPediaAPI";
import type { Planet } from "../../services/StarwarsPedia.types";
import LoadingGif from "../../components/LoadingGif";
import planetImages from "../../data/PlanetImages";
import "../../CSS/DetailsPage/PlanetDetailsPage.css";

const PlanetDetailsPage = () => {

    const { id } = useParams<{ id: string }>();
	const [planet, setPlanet] = useState<Planet | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
    const fetchPlanetData = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const res = await getPlanetById(Number(id));
            await new Promise(r => setTimeout(r, 1500));
            setPlanet(res);
        } catch (err) {
            setError(err instanceof Error 
                ? err.message 
                : "Failed to load planet");
        }
        setIsLoading(false); 
    };
    if (id)fetchPlanetData();
}, [id]);

    if (isLoading) return <LoadingGif />;
	if (error) return <p className="error-msg">{error}</p>;
	if (!planet) return null;

    return (
		<div
			className="planet-details-page">
			<img
				src={planetImages[planet.id] ?? "/images/placeholder.png"}
				alt={planet.name}
				className="planet-details-img"
			/>
			<div className="planet-details-info">
				<div className="planet-details-header">
					<h1>{planet.name}</h1>
					<button className="back-button" onClick={() => navigate(-1)}>
						← Back
					</button>
				</div>

				<p><strong>Climate:</strong> {planet.climate}</p>
				<p><strong>Terrain:</strong> {planet.terrain}</p>
				<p><strong>Population:</strong> {planet.population}</p>
				<p><strong>Gravity:</strong> {planet.gravity}</p>
				<p><strong>Orbital Period:</strong> {planet.orbital_period}</p>
				<p><strong>Rotation Period:</strong> {planet.rotation_period}</p>
				<p><strong>Diameter:</strong> {planet.diameter}</p>
			</div>
		</div>
	);
};

export default PlanetDetailsPage;
