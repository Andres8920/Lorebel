import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.jpg';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // No mostrar navbar en páginas de login/register
  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/productos" className="navbar-brand">
          <img src={logo} alt="Lorebel" className="navbar-logo" />
          <span>Sistema de Productos</span>
        </Link>

        {isAuthenticated && (
          <>
            <div className="navbar-menu">
              <Link 
                to="/productos" 
                className={`navbar-link ${location.pathname === '/productos' ? 'active' : ''}`}
              >
                📦 Productos
              </Link>
              <Link 
                to="/categorias" 
                className={`navbar-link ${location.pathname === '/categorias' ? 'active' : ''}`}
              >
                🏷️ Categorías
              </Link>
            </div>
            <div className="navbar-user">
              <span className="user-name">👤 {user?.username}</span>
              <button onClick={handleLogout} className="btn btn-logout">
                Cerrar Sesión
              </button>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
