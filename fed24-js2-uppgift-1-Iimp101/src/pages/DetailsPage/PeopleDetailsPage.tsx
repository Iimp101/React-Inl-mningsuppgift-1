import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPersonById } from "../../services/StarwarsPediaAPI";
import type { Person } from "../../services/StarwarsPedia.types";
import LoadingPagesGif from "../../components/LoadingPagesGif";
import lightsaberColor from "../../data/PeopleLightsaverColor";
import getTransparentColor from "../../components/TransparentColor";
import "../../CSS/DetailsPage/PeopleDetailsPage.css";



const PeopleDetailsPage = () => {

    const { id } = useParams<{ id: string }>();
	const [person, setPerson] = useState<Person | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();

    useEffect(() => {
		const fetchPersonData = async () => {
			setIsLoading(true);
			setError(null);
			try {
				const res = await getPersonById(Number(id));
				await new Promise((r) => setTimeout(r, 1500));
				setPerson(res);
			} catch (err) {
				setError(err instanceof Error 
                    ? err.message 
                    : "Failed to load person");
			}
			setIsLoading(false);
		};
		if (id) fetchPersonData();
	}, [id]);

    if (isLoading) return <LoadingPagesGif />;
	if (error) return <p className="error-msg">{error}</p>;
	if (!person) return null;

    return (
        <div
            className="person-details-page"
            style={{
                "--border-color": lightsaberColor[person.id] ?? "#cccccc",
                "--border-shadow": lightsaberColor[person.id]
                    ? getTransparentColor(lightsaberColor[person.id])
                    : "rgba(204, 204, 204, 0.3)"
            } as React.CSSProperties}
        >
            <img
                src={person.image_url ?? "/images/placeholder.png"}
                alt={person.name}
                className="person-details-img"
            />
            <div className="person-details-info">
                <div className="person-details-header">
                    <h1>{person.name}</h1>
                    <button className="back-button" onClick={() => navigate(-1)}>
                        ← Back
                    </button>
                </div>

                    <p><strong>Birth Year:</strong> {person.birth_year}</p>
                    <p><strong>Height:</strong> {person.height} cm</p>
                    <p><strong>Mass:</strong> {person.mass} kg</p>
                    <p><strong>Skin Color:</strong> {person.skin_color}</p>
                    <p><strong>Homeworld:</strong> {person.homeworld.name}</p>
                    <p><strong>Affiliations:</strong> {person.affiliations.join(", ")}</p>
                    <p><strong>Films:</strong> {person.films_count}</p>
                    <p><strong>Species:</strong> {person.species_count}</p>
                    <p><strong>Starships:</strong> {person.starships_count}</p>
                    <p><strong>Vehicles:</strong> {person.vehicles_count}</p>
                {person.wiki_link && (
                    <p>
                        <strong>More info:</strong>{" "}
                        <a href={person.wiki_link} target="_blank" rel="noopener noreferrer">
                            Wikipedia
                        </a>
                    </p>
                )}
            </div>
        </div>
    );  
};

export default PeopleDetailsPage;
