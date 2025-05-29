import { Route, Routes } from "react-router-dom";
import { useLocation } from "react-router-dom";
import PlanetDetailsPage from "./pages/DetailsPage/PlanetDetailsPage";
import FilmDetailsPage from "./pages/DetailsPage/FilmDetailsPage";
import PeopleDetailsPage from "./pages/DetailsPage/PeopleDetailsPage";
import SpeciesDetailsPage from "./pages/DetailsPage/SpeciesDetailsPage";
import StarshipDetailsPage from "./pages/DetailsPage/StarshipDetailsPage";
import VehicleDetailsPage from "./pages/DetailsPage/VehicleDetailsPage";
import Navigation from "./components/Navigation";
import HomePage from "./pages/HomePage";
import PeoplesPage from "./pages/PeoplesPage";
import PlanetsPage from "./pages/PlanetsPage";
import SpeciesPage from "./pages/SpeciesPage";
import StarshipsPage from "./pages/StarshipsPage";
import VehiclesPage from "./pages/VehiclesPage";
import FilmsPage from "./pages/FilmPage";
import Footer from "./components/Footer";
import SearchPage from "./pages/SearchPage";
import "./App.css";

function App() {

	const location = useLocation()
	const homePage = location.pathname === "/";
	return (
		<div className="page-wrapper">
			<Navigation />

			<main className={homePage ? "" : "app-content"}>
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/films" element={<FilmsPage />} />
					<Route path="/films/:id" element={<FilmDetailsPage />} />
					<Route path="/people" element={<PeoplesPage />} />
					<Route path="/people/:id" element={<PeopleDetailsPage />} />
					<Route path="/planets" element={<PlanetsPage />} />
					<Route path="/planets/:id" element={<PlanetDetailsPage />} />
					<Route path="/species" element={<SpeciesPage />} />
					<Route path="/species/:id" element={<SpeciesDetailsPage />} />
					<Route path="/starships" element={<StarshipsPage />} />
					<Route path="/starships/:id" element={<StarshipDetailsPage />} /> 
					<Route path="/vehicles" element={<VehiclesPage />} />
					<Route path="/vehicles/:id" element={<VehicleDetailsPage />} />
					<Route path="/search/" element={<SearchPage />} />
				</Routes>
			</main>

			<Footer />
		</div>
	);
}


export default App;
