import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { getFilmList } from "../services/StarwarsPediaAPI";
import type { Film } from "../services/StarwarsPedia.types";
import LoadingGif from "../components/LoadingGif";
import Pagination from "../components/Pagination";
import "../CSS/FilmPage.css";

const FilmsPage = () => {
	const [films, setFilms] = useState<Film[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [totalPages, setTotalPages] = useState(1);

	const [searchParams, setSearchParams] = useSearchParams();
	const page = parseInt(searchParams.get("page") || "1");
	const query = searchParams.get("query") || "";

	useEffect(() => {
		const fetchFilms = async () => {
			setIsLoading(true);
			setError(null);

			try {
				const response = await getFilmList(page, query);
				setFilms(response.data);
				setTotalPages(response.last_page);
			} catch (err) {
				setError(err instanceof Error 
					? err.message 
					: "Failed to load films");
			}
			
			setIsLoading(false);
		};

		fetchFilms();
	}, [page, query]);

	const goToPage = (newPage: number) => {
		const newParams: Record<string, string> = { page: newPage.toString() };
		if (query) newParams.query = query;
		setSearchParams(newParams);
	};

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

			{query && (
				<h2 className="search-results-heading">
					Search results for "{query}"
				</h2>
			)}

			{isLoading && <LoadingGif />}
			{error && <p className="error-msg">{error}</p>}

			{!isLoading && !error && films.length > 0 && (
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
										<p className="opening-crawl">
											{film.opening_crawl.slice(0, 150)}...
										</p>
									</div>
								</div>
							</Link>
						</li>
					))}
				</ul>
			)}

			{!isLoading && !error && films.length > 0 && (
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

			{!isLoading && !error && films.length === 0 && (
				<p className="no-results-msg">No results found for "{query}"</p>
			)}
		</div>
	);
};

export default FilmsPage;
