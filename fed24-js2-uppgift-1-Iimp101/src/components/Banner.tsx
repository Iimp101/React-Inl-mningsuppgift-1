import { useEffect, useState } from "react";
import "../CSS/HeroBanner.css";

const images = [
	"/images/Banner/9.jpg",
	"/images/Banner/3.jpg",
	"/images/Banner/2.jpg",
	"/images/Banner/4.jpg",
	"/images/Banner/8.jpg",
	"/images/Banner/5.jpg",
	"/images/Banner/7.jpg",
	"/images/Banner/6.jpg",
	"/images/Banner/1.jpg",
];

const HeroBanner = () => {
	const [currentBanner, setCurrentBanner] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentBanner((prev) => (prev + 1) % images.length);
		}, 5000);

		return () => clearInterval(interval);
	}, []);

	return (
		<div
			className="hero-banner"
			style={{
				backgroundImage: `url(${images[currentBanner]})`
			}}
		/>
	);
};

export default HeroBanner;
