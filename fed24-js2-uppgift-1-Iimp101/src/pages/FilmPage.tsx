import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFilmList } from "../services/StarwarsPediaAPI";
import type { Film, SWAPIListResponse } from "../services/StarwarsPedia.types";
import LoadingPagesGif from "../components/LoadingPagesGif";
import "../CSS/FilmPage.css";


const FilmsPage = () => {
	const [films, setFilms] = useState<Film[]>([]);
	const [isLoading, setIsLoading] = useState(false);
  	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
    const fetchFilms = async () => {
		setIsLoading(true);
		setError(null);

      	try {
			const response: SWAPIListResponse<Film> = await getFilmList();
			setFilms(response.data);
      	} catch (err) {
        setError(err instanceof Error
			? err.message
			: "Failed to load films"
			)
      	}

      	setIsLoading(false);
    };

    fetchFilms();
  	}, []);


	return (
    	<div className="films-page">
      		<h1 className="page-title with-lightsabers">
				<img
					src="/GIFS/lightsaberBlue2.gif"
					alt="Blue Lightsaber"
					className="lightsaber left"
				/>
				Star wars Films
				<img
					src="/GIFS/lightsaberRed2.gif"
					alt="Red Lightsaber"
					className="lightsaber right"
				/>
			</h1>

    	{isLoading && <LoadingPagesGif />}
    	{error && <p className="error-msg">{error}</p>}

    	{!isLoading && !error && (
			<ul className="film-list">
				{films.map((film) => (
					<li key={film.id}>
					<Link to={`/films/${film.id}`} className="film-card-link">
						<div className="film-card">
						<img
							src={film.image_url || "/images/placeholder.png"}
							alt={film.title}
							className="film-image"
						/>
						<div className="film-info">
							<h3>{film.title}</h3>
							<p><strong>Release:</strong> {film.release_date}</p>
							<p><strong>Director:</strong> {film.director}</p>
							<p><strong>Producer:</strong> {film.producer}</p>
							<p className="opening-crawl">{film.opening_crawl.slice(0, 150)}...</p>
						</div>
						</div>
					</Link>
					</li>
				))}
			</ul>
      	)}
    	</div>
  	)
}

export default FilmsPage;
