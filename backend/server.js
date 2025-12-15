/**
 * Servidor principal de la API REST
 * Gestiona productos con autenticación JWT y operaciones CRUD
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoriaRoutes from './routes/categoriaRoutes.js';

// Cargar configuración de variables de entorno
dotenv.config();

const app = express();

// Iniciar conexión con base de datos
connectDB();

// Configurar middlewares globales
app.use(cors()); // Habilitar CORS para peticiones desde frontend
app.use(express.json()); // Parsear JSON en request body
app.use(express.urlencoded({ extended: true })); // Parsear URL-encoded data

// Montar rutas de la API
app.use('/api/auth', authRoutes); // Autenticación: login, register, profile
app.use('/api/productos', productRoutes); // CRUD de productos (protegido)
app.use('/api/categorias', categoriaRoutes); // CRUD de categorías (protegido)

// Health check y documentación básica
app.get('/', (req, res) => {
  res.json({ 
    message: 'API de Productos - Lorebel',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      productos: '/api/productos',
      categorias: '/api/categorias'
    }
  });
});

// Capturar rutas no definidas
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    message: 'Ruta no encontrada' 
  });
});

// Handler global de errores no capturados
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Iniciar servidor HTTP
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📍 Entorno: ${process.env.NODE_ENV || 'development'}`);
});
