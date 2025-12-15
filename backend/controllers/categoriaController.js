/**
 * Controlador de Categorías
 * Gestiona operaciones CRUD de categorías personalizadas
 */

import { validationResult } from 'express-validator';
import Categoria from '../models/Categoria.js';
import Product from '../models/Product.js';

/**
 * Obtiene todas las categorías con paginación
 * @route   GET /api/categorias
 * @access  Private
 */
export const getCategorias = async (req, res) => {
  try {
    // Parámetros de paginación
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Construir query
    const query = {};

    // Filtro por nombre (búsqueda)
    if (req.query.search) {
      query.$or = [
        { nombre: { $regex: req.query.search, $options: 'i' } },
        { descripcion: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // Filtro por estado activo
    if (req.query.activo !== undefined) {
      query.activo = req.query.activo === 'true';
    }

    // Obtener total de documentos
    const total = await Categoria.countDocuments(query);

    // Obtener categorías con paginación
    const categorias = await Categoria.find(query)
      .populate('createdBy', 'username email')
      .sort('nombre')
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      count: categorias.length,
      data: categorias,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        perPage: limit,
        totalItems: total,
        hasNext: page * limit < total,
        hasPrev: skip > 0
      }
    });
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener categorías',
      error: error.message
    });
  }
};

/**
 * Obtiene una categoría por ID
 * @route   GET /api/categorias/:id
 * @access  Private
 */
export const getCategoria = async (req, res) => {
  try {
    const categoria = await Categoria.findById(req.params.id)
      .populate('createdBy', 'username email');

    if (!categoria) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }

    res.json({
      success: true,
      data: categoria
    });
  } catch (error) {
    console.error('Error al obtener categoría:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error al obtener categoría',
      error: error.message
    });
  }
};

/**
 * Crea una nueva categoría
 * @route   POST /api/categorias
 * @access  Private
 */
export const createCategoria = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Errores de validación',
        errors: errors.array()
      });
    }

    const { nombre, descripcion, icono } = req.body;

    // Verificar si ya existe
    const categoriaExists = await Categoria.findOne({ nombre });
    if (categoriaExists) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe una categoría con ese nombre'
      });
    }

    const categoria = await Categoria.create({
      nombre,
      descripcion,
      icono,
      createdBy: req.user._id
    });

    const populatedCategoria = await Categoria.findById(categoria._id)
      .populate('createdBy', 'username email');

    res.status(201).json({
      success: true,
      message: 'Categoría creada exitosamente',
      data: populatedCategoria
    });
  } catch (error) {
    console.error('Error al crear categoría:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear categoría',
      error: error.message
    });
  }
};

/**
 * Actualiza una categoría
 * @route   PUT /api/categorias/:id
 * @access  Private
 */
export const updateCategoria = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Errores de validación',
        errors: errors.array()
      });
    }

    const categoria = await Categoria.findById(req.params.id);

    if (!categoria) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }

    const { nombre, descripcion, icono, activo } = req.body;

    // Verificar nombre duplicado
    if (nombre && nombre !== categoria.nombre) {
      const exists = await Categoria.findOne({ nombre });
      if (exists) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe una categoría con ese nombre'
        });
      }
    }

    if (nombre !== undefined) categoria.nombre = nombre;
    if (descripcion !== undefined) categoria.descripcion = descripcion;
    if (icono !== undefined) categoria.icono = icono;
    if (activo !== undefined) categoria.activo = activo;

    const updatedCategoria = await categoria.save();

    const populatedCategoria = await Categoria.findById(updatedCategoria._id)
      .populate('createdBy', 'username email');

    res.json({
      success: true,
      message: 'Categoría actualizada exitosamente',
      data: populatedCategoria
    });
  } catch (error) {
    console.error('Error al actualizar categoría:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error al actualizar categoría',
      error: error.message
    });
  }
};

/**
 * Elimina una categoría
 * @route   DELETE /api/categorias/:id
 * @access  Private
 */
export const deleteCategoria = async (req, res) => {
  try {
    const categoria = await Categoria.findById(req.params.id);

    if (!categoria) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }

    // Verificar si hay productos asociados a esta categoría
    const productosAsociados = await Product.countDocuments({ categoria: req.params.id });
    
    if (productosAsociados > 0) {
      return res.status(400).json({
        success: false,
        message: `No se puede eliminar la categoría porque tiene ${productosAsociados} producto(s) asociado(s). Primero elimina o reasigna los productos.`
      });
    }

    await categoria.deleteOne();

    res.json({
      success: true,
      message: 'Categoría eliminada exitosamente',
      data: { id: req.params.id }
    });
  } catch (error) {
    console.error('Error al eliminar categoría:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error al eliminar categoría',
      error: error.message
    });
  }
};
