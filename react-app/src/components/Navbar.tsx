import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

function Navbar() {
  const { t } = useTranslation();

  return <nav className="navbar navbar-expand-lg navbar-light bg-light">
    <Link className="navbar-brand ms-2" to="/">{t('app_title')}</Link>
    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarNavDropdown">
      <ul className="navbar-nav">
        <li className="nav-item active">
          <Link className="nav-link" to="/">{t('home')}</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/Devices">{t('devices')}</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/Experiments">{t('experiments')}</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/Procedures">{t('procedures')}</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/Settings">{t('settings')}</Link>
        </li>
      </ul>
    </div>
  </nav>
}

export default Navbar;