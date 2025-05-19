
import { Route, Routes } from 'react-router-dom'
import Navigation from './components/Navigation';
import Container from 'react-bootstrap/Container';
import HomePage from './pages/HomePage';
import PeoplesPages from './pages/PeoplesPage';
import './App.css'
import PlanetsPages from './pages/PlanetsPage';
import SpeciesPage from './pages/SpeciesPage';
import StarshipsPage from './pages/StarshipsPage';
import VehiclesPage from './pages/VehiclesPage';

function App() {
	return (
    	<>
			<Navigation />
			<Container className="my-4">
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/people" element={<PeoplesPages />} />
					<Route path="/planets" element={<PlanetsPages />} />
					<Route path="/species" element={<SpeciesPage/>} />
					<Route path="/starships" element={<StarshipsPage />} />
					<Route path="/vehicles" element={<VehiclesPage />} />
				</Routes>
			</Container>
    	</>
  	)
}

export default App
