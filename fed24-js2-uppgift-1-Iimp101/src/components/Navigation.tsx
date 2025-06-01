import { useState, useRef } from "react";
import { NavLink } from "react-router-dom";
import SearchForm from "./SearchForm";
import "../CSS/Navigation.css";

const Navigation = () => {
	const [audioPlaying, setAudioPlaying] = useState(false);
	const [volume, setVolume] = useState(0.5);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const audioRef = useRef<HTMLAudioElement | null>(null);

	const toggleAudio = () => {
		if (!audioRef.current) return;

		audioRef.current.volume = volume;

		if (audioPlaying) {
			audioRef.current.pause();
		} else {
			audioRef.current.play();
		}
		setAudioPlaying(!audioPlaying);
	};

	const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newVolume = parseFloat(e.target.value);
		setVolume(newVolume);

		if (audioRef.current) {
			audioRef.current.volume = newVolume;
		}
	};

	const handleNavLinkClick = () => {
		setIsMenuOpen(false);
	};

	return (
		<header className="starwars-navbar">
			<div className="nav-container">
				<div className="nav-left">
					<NavLink to="/" className="starwars-logo" onClick={handleNavLinkClick}>
						🌌 Star Wars DB
					</NavLink>
				</div>

				<button
					className="nav-toggle"
					onClick={() => setIsMenuOpen((prev) => !prev)}
					aria-label="Toggle navigation"
				>
					☰
				</button>

				<nav className={`nav-center ${isMenuOpen ? "open" : ""}`}>
					<NavLink to="/films" className="nav-link" onClick={handleNavLinkClick}>
						Films
					</NavLink>
					<NavLink to="/people" className="nav-link" onClick={handleNavLinkClick}>
						People
					</NavLink>
					<NavLink to="/planets" className="nav-link" onClick={handleNavLinkClick}>
						Planets
					</NavLink>
					<NavLink to="/species" className="nav-link" onClick={handleNavLinkClick}>
						Species
					</NavLink>
					<NavLink to="/starships" className="nav-link" onClick={handleNavLinkClick}>
						Starships
					</NavLink>
					<NavLink to="/vehicles" className="nav-link" onClick={handleNavLinkClick}>
						Vehicles
					</NavLink>
				</nav>

				<div className="nav-right">
					<button onClick={toggleAudio} className="sound-toggle">
						{audioPlaying ? "🔊 On" : "🔇 Off"}
					</button>
					<input
						type="range"
						min="0"
						max="1"
						step="0.01"
						value={volume}
						onChange={handleVolumeChange}
						className="lightsaber-slider"
						title="Volume"
					/>
					<SearchForm />
					<audio ref={audioRef} loop>
						<source src="/sounds/Starwars-Lobby-Music.mp3" type="audio/mpeg" />
					</audio>
				</div>
			</div>
		</header>
	);
};

export default Navigation;
