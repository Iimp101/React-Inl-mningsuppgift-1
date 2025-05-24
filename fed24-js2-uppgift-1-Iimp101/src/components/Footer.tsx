import "../CSS/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
        <p>© {new Date().getFullYear()} Star Wars DB. All rights reserved by Jedi Iimp.</p>
        <p>Made with ❤️ and lightsabers by a galaxy far, far away.</p>
    </footer>
    );
};

export default Footer;
