import { FaGithub, FaLinkedin } from "react-icons/fa";
import "../CSS/Footer.css";

const Footer = () => {
  	return (
		<footer className="footer">
			<p>© {new Date().getFullYear()} Star Wars DB. All rights <strong>NOT</strong> reserved by Jedi Iimp.</p>
			<p>Made with ❤️ and lightsabers by a galaxy far, far away.</p>

			<div className="social-icons">
				<a href="https://github.com/Iimp101" target="_blank" rel="noopener noreferrer">
					<FaGithub />
				</a>
				<a href="https://www.linkedin.com/in/magnus-lundberg-082306264/" target="_blank" rel="noopener noreferrer">
					<FaLinkedin />
				</a>
			</div>
		</footer>
  	);
};

export default Footer;
