import { useState, useRef } from "react";
import { NavLink } from "react-router-dom";
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
		<header className="starwars-navbar">
			<div className="nav-container">
				
				{/* Vänster: Logo */}
				<div className="nav-left">
					<NavLink to="/" className="starwars-logo">🌌 Starwars DB</NavLink>
				</div>

				{/* Mitten: Nav länkar */}
				<nav className="nav-center">
					<NavLink to="/films" className="nav-link">Films</NavLink>
					<NavLink to="/people" className="nav-link">People</NavLink>
					<NavLink to="/planets" className="nav-link">Planets</NavLink>
					<NavLink to="/species" className="nav-link">Species</NavLink>
					<NavLink to="/starships" className="nav-link">Starships</NavLink>
					<NavLink to="/vehicles" className="nav-link">Vehicles</NavLink>
				</nav>

				{/* Höger: Ljudknapp */}
				<div className="nav-right">
					<button onClick={toggleAudio} className="sound-toggle">
						{audioPlaying ? "🔊 On" : "🔇 Off"}
					</button>
					<audio ref={audioRef} loop>
						<source src="/sounds/starwars-theme.mp3" type="audio/mpeg" />
					</audio>
				</div>

			</div>
		</header>
	);
};

export default Navigation;
