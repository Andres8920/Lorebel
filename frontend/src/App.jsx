/**
 * Componente raíz de la aplicación
 * Configura routing y providers globales
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import Categorias from './pages/Categorias';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <div className="container">
            <Routes>
              {/* Rutas públicas */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Rutas protegidas */}
              <Route 
                path="/productos" 
                element={
                  <PrivateRoute>
                    <Products />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/categorias" 
                element={
                  <PrivateRoute>
                    <Categorias />
                  </PrivateRoute>
                } 
              />
              
              {/* Redirecciones */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
