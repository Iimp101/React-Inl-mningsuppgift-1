import { Route, Routes } from "react-router-dom";
import Navigation from "./components/Navigation";
import HomePage from "./pages/HomePage";
import PeoplesPages from "./pages/PeoplesPage";
import PlanetsPages from "./pages/PlanetsPage";
import SpeciesPage from "./pages/SpeciesPage";
import StarshipsPage from "./pages/StarshipsPage";
import VehiclesPage from "./pages/VehiclesPage";
import FilmsPage from "./pages/FilmPage";
import "./App.css";

function App() {
	return (
		<>
			<Navigation />

			<div>
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/people" element={<PeoplesPages />} />
					<Route path="/films" element={<FilmsPage />} />
					<Route path="/planets" element={<PlanetsPages />} />
					<Route path="/species" element={<SpeciesPage />} />
					<Route path="/starships" element={<StarshipsPage />} />
					<Route path="/vehicles" element={<VehiclesPage />} />
				</Routes>
			</div>
		</>
	);
}

export default App;
