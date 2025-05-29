import { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import {
  getFilmList,
  getPersonList,
  getPlanetList,
  getSpeciesList,
  getStarshipList,
  getVehicleList,
} from "../services/StarwarsPediaAPI";
import type {
  Film,
  Person,
  Planet,
  Species,
  Starship,
  Vehicle,
} from "../services/StarwarsPedia.types";
import Pagination from "../components/Pagination";
import LoadingPagesGif from "../components/LoadingPagesGif";

interface CategoryConfig {
    name: string;
    getList: (page: number, query?: string) => Promise<{ data: (Film | Person | Planet | Species | Starship | Vehicle)[]; total: number }>;
    setData: React.Dispatch<React.SetStateAction<(Film | Person | Planet | Species | Starship | Vehicle)[]>>;
    setTotal: React.Dispatch<React.SetStateAction<number>>;
}

const SearchPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const query = searchParams.get("query") || "";
    const currentPage = Number(searchParams.get("page")) || 1;

    const [films, setFilms] = useState<Film[]>([]);
    const [people, setPeople] = useState<Person[]>([]);
    const [planets, setPlanets] = useState<Planet[]>([]);
    const [species, setSpecies] = useState<Species[]>([]);
    const [starships, setStarships] = useState<Starship[]>([]);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);

    const [totalFilms, setTotalFilms] = useState(0);
    const [totalPeople, setTotalPeople] = useState(0);
    const [totalPlanets, setTotalPlanets] = useState(0);
    const [totalSpecies, setTotalSpecies] = useState(0);
    const [totalStarships, setTotalStarships] = useState(0);
    const [totalVehicles, setTotalVehicles] = useState(0);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [noResults, setNoResults] = useState(false);
    const [redirecting, setRedirecting] = useState(false);


  useEffect(() => {

    const categories = [
        { name: "films", getList: getFilmList, setData: setFilms, setTotal: setTotalFilms },
        { name: "people", getList: getPersonList, setData: setPeople, setTotal: setTotalPeople },
        { name: "planets", getList: getPlanetList, setData: setPlanets, setTotal: setTotalPlanets },
        { name: "species", getList: getSpeciesList, setData: setSpecies, setTotal: setTotalSpecies },
        { name: "starships", getList: getStarshipList, setData: setStarships, setTotal: setTotalStarships },
        { name: "vehicles", getList: getVehicleList, setData: setVehicles, setTotal: setTotalVehicles },
    ];

    if (query.trim().length < 2) return;

    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      setNoResults(false);

      try {
        const results = await Promise.all(
          categories.map((cat) => {
            const isAllQuery = query.toLowerCase() === cat.name;
            return cat.getList(currentPage, isAllQuery ? undefined : query);
          })
        );

        results.forEach((res, i) => {
          categories[i].setData(res.data);
          categories[i].setTotal(res.total);
        });

        const allResultsTotal = results.reduce((sum, res) => sum + res.total, 0);

        if (allResultsTotal === 0) {
          setTimeout(() => {
            setNoResults(true);
            setLoading(false);
          }, 1500);
          return;
        }

        if (allResultsTotal === 1) {
          setRedirecting(true);
          const single = results.find((res) => res.total === 1);
          const category = categories[results.findIndex((res) => res.total === 1)];
          if (single && category) {
            return navigate(`/${category.name}/${single.data[0].id}`);
          }
        }

        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load your request");
        setLoading(false);
      }
    };

    fetchAll();
  }, [query, currentPage, navigate]);

  const goToPage = (page: number) => {
    setSearchParams({ query, page: page.toString() });
  };

  const renderCategory = <T extends { id: number; name?: string; title?: string; image_url?: string | null }>(
    title: string,
    items: T[],
    basePath: string,
    totalItems: number
  ) => {
    if (items.length === 0) return null;

    const itemsPerPage = 10;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    return (
      <div className="search-category">
        <h2>{title}</h2>
        <ul className="search-result-list">
          {items.map((item) => (
            <li key={item.id}>
              <Link to={`/${basePath}/${item.id}`} className="search-result-card">
                <img
                  src={item.image_url ?? "/images/placeholder.png"}
                  alt={item.title || item.name}
                  className="search-result-image"
                />
                <p>{item.title || item.name}</p>
              </Link>
            </li>
          ))}
        </ul>

        {totalPages > 1 && (
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

  if (redirecting) {
    return null;
  }

  if (loading) {
    return (
      <div className="search-page">
        <LoadingPagesGif />
      </div>
    );
  }

  return (
    <div className="search-page">
      {error && <p className="error-msg">{error}</p>}

      {noResults ? (
        <p className="no-results-msg">
          ❌ No results found for "{query}" in the Star Wars database.
        </p>
      ) : (
        <>
          {renderCategory("Films", films, "films", totalFilms)}
          {renderCategory("People", people, "people", totalPeople)}
          {renderCategory("Planets", planets, "planets", totalPlanets)}
          {renderCategory("Species", species, "species", totalSpecies)}
          {renderCategory("Starships", starships, "starships", totalStarships)}
          {renderCategory("Vehicles", vehicles, "vehicles", totalVehicles)}
        </>
      )}
    </div>
  );
};

export default SearchPage;
