/**
 * Rutas de Categorías
 * Endpoints para gestión de categorías personalizadas
 */

import express from 'express';
import { body } from 'express-validator';
import { protect } from '../middleware/auth.js';
import {
  getCategorias,
  getCategoria,
  createCategoria,
  updateCategoria,
  deleteCategoria
} from '../controllers/categoriaController.js';

const router = express.Router();

// Validaciones
const categoriaValidation = [
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre es requerido')
    .isLength({ min: 2, max: 50 }).withMessage('El nombre debe tener entre 2 y 50 caracteres'),
  body('descripcion')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('La descripción no puede exceder 200 caracteres'),
  body('icono')
    .optional()
    .trim()
];

// Todas las rutas requieren autenticación
router.use(protect);

// GET /api/categorias - Obtener todas
// POST /api/categorias - Crear nueva
router.route('/')
  .get(getCategorias)
  .post(categoriaValidation, createCategoria);

// GET /api/categorias/:id - Obtener una
// PUT /api/categorias/:id - Actualizar
// DELETE /api/categorias/:id - Eliminar
router.route('/:id')
  .get(getCategoria)
  .put(categoriaValidation, updateCategoria)
  .delete(deleteCategoria);

export default router;
