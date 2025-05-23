import { useState, useRef } from "react";
import { NavLink } from "react-router-dom";
import "../CSS/Navigation.css";

const Navigation = () => {
	const [audioPlaying, setAudioPlaying] = useState(false);
	const [volume, setVolume] = useState(0.5);
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

	return (
		<header className="starwars-navbar">
			<div className="nav-container">

				<div className="nav-left">
					<NavLink to="/" className="starwars-logo">🌌 Star wars DB</NavLink>
				</div>

				<nav className="nav-center">
					<NavLink to="/films" className="nav-link">Films</NavLink>
					<NavLink to="/people" className="nav-link">People</NavLink>
					<NavLink to="/planets" className="nav-link">Planets</NavLink>
					<NavLink to="/species" className="nav-link">Species</NavLink>
					<NavLink to="/starships" className="nav-link">Starships</NavLink>
					<NavLink to="/vehicles" className="nav-link">Vehicles</NavLink>
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
					<audio ref={audioRef} loop>
						<source src="/sounds/Starwars-Lobby-Music.mp3" type="audio/mpeg" />
					</audio>
				</div>

			</div>
		</header>
	);
};

export default Navigation;
