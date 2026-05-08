import { NavLink } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="navbar-brand">
          <span className="brand-icon">◆</span>
          <span className="brand-text">My Space</span>
        </NavLink>
        <div className="navbar-links">
          <NavLink to="/" end className="nav-link">
            About
          </NavLink>
          <NavLink to="/showcase" className="nav-link">
            Portfolio
          </NavLink>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
