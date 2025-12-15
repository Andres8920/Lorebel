/**
 * Middleware de autenticación JWT
 * Protege rutas y valida tokens en requests
 */

import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Middleware para proteger rutas privadas
 * Verifica token JWT en Authorization header y adjunta usuario a req
 */
export const protect = async (req, res, next) => {
  let token;

  // Extraer token del header Authorization: Bearer <token>
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Verificar firma y validez del token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Cargar usuario completo (excepto password) y adjuntar a request
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      next(); // Usuario autenticado, continuar al controller
    } catch (error) {
      console.error('Error en autenticación:', error.message);
      
      // Responder según tipo de error JWT
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Token no válido'
        });
      }
      
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token expirado'
        });
      }

      return res.status(401).json({
        success: false,
        message: 'No autorizado, token inválido'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No autorizado, no hay token'
    });
  }
};

/**
 * Genera un JWT firmado para autenticación
 * @param {string} id - ID del usuario en MongoDB
 * @returns {string} Token JWT válido por 30 días
 */
export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};
