import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getFilmById } from "../../services/StarwarsPediaAPI";
import type { Film } from "../../services/StarwarsPedia.types";
import LoadingPagesGif from "../../components/LoadingPagesGif";
import "../../CSS/DetailsPage/FilmDetailsPage.css";

const FilmDetailsPage = () => {

    const { id } = useParams<{id: string}>();
    const [film, setFilm] = useState<Film | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();


    useEffect(() => {

        const fetchFilmData = async () => {
        setIsLoading(true)
        setError(null);

        try {

            const res = await getFilmById(Number(id));
            await new Promise(r => setTimeout(r, 1500));
            setFilm(res);
        }

        catch (err) {
            setError(err instanceof Error 
                ? err.message 
                : "Failed to load film");
            };
            setIsLoading(false);
        };
        if (id) fetchFilmData(); 
    }, [id]);

    if (isLoading) return <LoadingPagesGif />;
	if (error) return <p className="error-msg">{error}</p>;
	if (!film) return null;


    return (
		<div className="film-details-page">

            
            <img src={film.image_url ?? "/images/placeholder.png"} alt={film.title} className="film-details-img" />

            <div className="film-details-info">
                <div className="film-details-header">
                    <h1>{film.title} (Episode {film.episode_id})</h1>
                    <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
                </div>
              
                <p><strong>Director:</strong> {film.director}</p>
                <p><strong>Producer:</strong> {film.producer}</p>
                <p><strong>Release Date:</strong> {film.release_date}</p>
                <p className="opening-crawl">{film.opening_crawl}</p>
                <p><strong>Characters:</strong> {film.characters_count}</p>
                <p><strong>Planets:</strong> {film.planets_count}</p>
                <p><strong>Starships:</strong> {film.starships_count}</p>
                <p><strong>Vehicles:</strong> {film.vehicles_count}</p>
                <p><strong>Species:</strong> {film.species_count}</p>
            </div>
        </div>
	);
}

export default FilmDetailsPage;
