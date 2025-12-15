/**
 * Controlador de Productos
 * Gestiona operaciones CRUD con filtrado, búsqueda y paginación
 */

import { validationResult } from 'express-validator';
import Product from '../models/Product.js';
import Categoria from '../models/Categoria.js';

/**
 * Obtiene productos con filtros, búsqueda y paginación
 * @route   GET /api/products
 * @access  Private
 * @query   {string} categoria - Filtrar por categoría
 * @query   {number} minPrecio - Precio mínimo
 * @query   {number} maxPrecio - Precio máximo
 * @query   {string} search - Búsqueda en nombre y descripción
 * @query   {number} page - Número de página (default: 1)
 * @query   {number} limit - Items por página (default: 10)
 */
export const getProducts = async (req, res) => {
  try {
    const { 
      categoria, 
      minPrecio, 
      maxPrecio, 
      search, 
      sort = '-createdAt',
      page = 1,
      limit = 10
    } = req.query;

    // Construir objeto de filtros dinámicamente
    let filter = {};

    if (categoria) {
      filter.categoria = categoria;
    }

    // Filtrar por rango de precios
    if (minPrecio || maxPrecio) {
      filter.precio = {};
      if (minPrecio) filter.precio.$gte = Number(minPrecio);
      if (maxPrecio) filter.precio.$lte = Number(maxPrecio);
    }

    // Búsqueda full-text en nombre y descripción
    if (search) {
      // Escapar caracteres especiales de regex
      const searchEscaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.$or = [
        { nombre: { $regex: searchEscaped, $options: 'i' } },
        { descripcion: { $regex: searchEscaped, $options: 'i' } }
      ];
    }

    // Calcular offsets para paginación
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = pageNum * limitNum;

    // Obtener total de items que coinciden con filtros
    const total = await Product.countDocuments(filter);

    // Query con paginación y populate de usuario creador y categoría
    const products = await Product.find(filter)
      .populate('createdBy', 'username email')
      .populate('categoria', 'nombre icono')
      .sort(sort)
      .skip(startIndex)
      .limit(limitNum);

    // Metadata de paginación para frontend
    const pagination = {
      current: pageNum,
      total: Math.ceil(total / limitNum),
      perPage: limitNum,
      totalItems: total,
      hasNext: endIndex < total,
      hasPrev: startIndex > 0
    };

    res.json({
      success: true,
      count: products.length,
      pagination,
      data: products
    });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener productos',
      error: error.message
    });
  }
};

/**
 * Obtiene un producto específico por ID
 * @route   GET /api/products/:id
 * @access  Private
 */
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('createdBy', 'username email')
      .populate('categoria', 'nombre icono');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error al obtener producto:', error);
    
    // Manejar IDs de MongoDB inválidos
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error al obtener producto',
      error: error.message
    });
  }
};

/**
 * Crea un nuevo producto
 * @route   POST /api/products
 * @access  Private
 */
export const createProduct = async (req, res) => {
  try {
    // Validar datos del request con express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Errores de validación',
        errors: errors.array()
      });
    }

    const { nombre, descripcion, precio, stock, categoria, imagen } = req.body;

    // Verificar que la categoría existe
    if (categoria) {
      const categoriaExiste = await Categoria.findById(categoria);
      if (!categoriaExiste) {
        return res.status(400).json({
          success: false,
          message: 'La categoría seleccionada no existe'
        });
      }
    }

    // Crear producto asociado al usuario autenticado
    const productData = {
      nombre,
      descripcion,
      precio,
      stock,
      categoria,
      createdBy: req.user._id
    };

    // Solo agregar imagen si tiene valor
    if (imagen && imagen.trim() !== '') {
      productData.imagen = imagen;
    }

    const product = await Product.create(productData);

    // Retornar producto con datos del usuario y categoría poblados
    const populatedProduct = await Product.findById(product._id)
      .populate('createdBy', 'username email')
      .populate('categoria', 'nombre icono');

    res.status(201).json({
      success: true,
      message: 'Producto creado exitosamente',
      data: populatedProduct
    });
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear producto',
      error: error.message
    });
  }
};

/**
 * Actualiza un producto existente
 * @route   PUT /api/products/:id
 * @access  Private
 */
export const updateProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Errores de validación',
        errors: errors.array()
      });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    // Actualizar solo campos proporcionados en el body
    const { nombre, descripcion, precio, stock, categoria, imagen, activo } = req.body;

    // Verificar que la categoría existe si se está actualizando
    if (categoria !== undefined) {
      const categoriaExiste = await Categoria.findById(categoria);
      if (!categoriaExiste) {
        return res.status(400).json({
          success: false,
          message: 'La categoría seleccionada no existe'
        });
      }
    }

    if (nombre !== undefined) product.nombre = nombre;
    if (descripcion !== undefined) product.descripcion = descripcion;
    if (precio !== undefined) product.precio = precio;
    if (stock !== undefined) product.stock = stock;
    if (categoria !== undefined) product.categoria = categoria;
    if (imagen !== undefined) {
      // Si imagen está vacía, eliminar el campo (dejarlo null)
      product.imagen = (imagen && imagen.trim() !== '') ? imagen : null;
    }
    if (activo !== undefined) product.activo = activo;

    const updatedProduct = await product.save();

    // Retornar con datos poblados
    const populatedProduct = await Product.findById(updatedProduct._id)
      .populate('createdBy', 'username email')
      .populate('categoria', 'nombre icono');

    res.json({
      success: true,
      message: 'Producto actualizado exitosamente',
      data: populatedProduct
    });
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error al actualizar producto',
      error: error.message
    });
  }
};

/**
 * Elimina un producto de la base de datos
 * @route   DELETE /api/products/:id
 * @access  Private
 */
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    await product.deleteOne();

    res.json({
      success: true,
      message: 'Producto eliminado exitosamente',
      data: { id: req.params.id }
    });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error al eliminar producto',
      error: error.message
    });
  }
};
