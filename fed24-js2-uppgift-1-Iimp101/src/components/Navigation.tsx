import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";
import { NavLink } from "react-router-dom";
import { useState, useRef } from "react";
import "../CSS/Navigation.css";

const Navigation = () => {
	const [audioPlaying, setAudioPlaying] = useState(false);
	const audioRef = useRef<HTMLAudioElement | null>(null);

	const toggleAudio = () => {
		if (!audioRef.current) return;

		if (audioPlaying) {
			audioRef.current.pause();
		} else {
			audioRef.current.play();
		}
		setAudioPlaying(!audioPlaying);
	};

	return (
		<Navbar bg="black" variant="dark" expand="md" sticky="top" className="starwars-navbar">
			<Container fluid>
				<div className="d-flex justify-content-between align-items-center w-100">
					
					{/* Vänster: Brand */}
					<Navbar.Brand as={NavLink} to="/" className="fw-bold starwars-logo me-auto">
						🌌 Starwars DB
					</Navbar.Brand>

					{/* Mitten: Nav länkar */}
					<Nav className="mx-auto nav-links">
						<Nav.Link as={NavLink} to="/films">Films</Nav.Link>
						<Nav.Link as={NavLink} to="/people">People</Nav.Link>
						<Nav.Link as={NavLink} to="/planets">Planets</Nav.Link>
						<Nav.Link as={NavLink} to="/species">Species</Nav.Link>
						<Nav.Link as={NavLink} to="/starships">Starships</Nav.Link>
						<Nav.Link as={NavLink} to="/vehicles">Vehicles</Nav.Link>
					</Nav>

					{/* Höger: Ljudknapp */}
					<Button
						variant={audioPlaying ? "warning" : "outline-warning"}
						size="sm"
						onClick={toggleAudio}
						className="sound-toggle ms-auto"
					>
						{audioPlaying ? "🔊 On" : "🔇 Off"}
					</Button>

					{/* Ljud */}
					<audio ref={audioRef} loop>
						<source src="/sounds/starwars-theme.mp3" type="audio/mpeg" />
					</audio>
				</div>
			</Container>
		</Navbar>
	);
};

export default Navigation;
